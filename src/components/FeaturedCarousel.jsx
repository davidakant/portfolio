import { useEffect, useRef, useState } from 'react'
import styles from './FeaturedCarousel.module.css'

// Shows ~2 1/6 cards at a time on desktop (see .card's flex-basis) so the
// sliver of the next card hints there's more to scroll to; collapses to one
// full-width card on narrow viewports (see the module's max-width: 800px
// query). Advances by native horizontal scroll + scroll-snap rather than a
// Framer Motion transform — that gets touch/trackpad swipe, momentum, and
// snapping for free instead of reimplementing them, and it's what the arrow
// buttons and dots drive too (scrollTo/scrollBy), so every input method ends
// up at the same snapped positions.
export default function FeaturedCarousel({ projects, onWatchFilm }) {
  const viewportRef = useRef(null)
  const firstCardRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const getStep = () => {
    const viewport = viewportRef.current
    const card = firstCardRef.current
    if (!viewport || !card) return 0
    const gap = parseFloat(getComputedStyle(viewport).columnGap || getComputedStyle(viewport).gap || '0') || 0
    return card.getBoundingClientRect().width + gap
  }

  const scrollToIndex = (index, behavior = 'smooth') => {
    const viewport = viewportRef.current
    const step = getStep()
    if (!viewport || !step) return
    const clamped = Math.max(0, Math.min(index, projects.length - 1))
    viewport.scrollTo({ left: clamped * step, behavior })
  }

  // Deliberately relative to the viewport's actual current scroll position
  // (scrollBy), not an absolute index * step target (scrollTo). With few
  // enough cards the "end" resting position falls short of the last card's
  // own index * step (the browser clamps it there) — so an absolute target
  // computed from activeIndex - 1 can ask to scroll *forward* to reach
  // "the previous card," which the browser then clamps right back to where
  // it already was, making Prev look like it does nothing. Scrolling by a
  // fixed step relative to wherever the viewport actually is sidesteps that
  // entirely, in either direction.
  const goPrev = () => {
    const viewport = viewportRef.current
    const step = getStep()
    if (!viewport || !step) return
    viewport.scrollBy({ left: -step, behavior: 'smooth' })
  }
  const goNext = () => {
    const viewport = viewportRef.current
    const step = getStep()
    if (!viewport || !step) return
    viewport.scrollBy({ left: step, behavior: 'smooth' })
  }

  // Keeps the dots/disabled-arrow state in sync with wherever the user
  // actually lands — a drag/swipe or trackpad scroll moves the viewport
  // without going through goPrev/goNext, so activeIndex has to be derived
  // from scroll position rather than only set by the nav handlers.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined
    let frame = null
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const step = getStep()
        if (!step) return
        // With few enough cards, the last card's "own" step (index * step)
        // can exceed the actual max scroll — the browser clamps scrollLeft
        // there instead, which the round(scrollLeft / step) below would
        // read as some earlier index, leaving Next stuck enabled at the
        // true end. Snapping the two extremes to native scroll bounds
        // fixes that; anything in between still rounds to the nearest step.
        const maxScroll = viewport.scrollWidth - viewport.clientWidth
        let idx
        if (viewport.scrollLeft >= maxScroll - 1) idx = projects.length - 1
        else if (viewport.scrollLeft <= 1) idx = 0
        else idx = Math.round(viewport.scrollLeft / step)
        setActiveIndex((prev) => {
          const clamped = Math.max(0, Math.min(idx, projects.length - 1))
          return prev === clamped ? prev : clamped
        })
      })
    }
    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      viewport.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [projects.length])

  const multiple = projects.length > 1

  return (
    <div className={styles.carousel}>
      {multiple && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={goPrev}
          disabled={activeIndex === 0}
          data-cursor-hover
          aria-label="Previous featured project"
        >
          ‹
        </button>
      )}

      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={i === 0 ? firstCardRef : undefined}
              className={project.isPlaceholder ? styles.placeholder : styles.card}
            >
              {project.isPlaceholder ? (
                <>
                  <span className={styles.placeholderLabel}>COMING SOON</span>
                  <p className={styles.placeholderText}>A new featured project is on the way.</p>
                </>
              ) : (
                <>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.media}
                    data-cursor-hover
                    aria-label={`View ${project.title} live site`}
                  >
                    <img src={project.image} alt={project.imageAlt} className={styles.image} loading="lazy" />
                    <div className={styles.sheen} aria-hidden="true" />
                  </a>
                  <div className={styles.body}>
                    <span className={styles.tag}>{project.tag}</span>
                    <h2 className={styles.title}>{project.title}</h2>
                    <p className={styles.tagline}>{project.tagline}</p>
                    <p className={styles.text}>{project.text}</p>
                    <p className={styles.note}>{project.note}</p>
                    <div className={styles.ctaRow}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cta}
                        data-cursor-hover
                      >
                        View Live Site ↗
                      </a>
                      {project.filmUrl && (
                        <>
                          <span className={styles.ctaDivider} aria-hidden="true">
                            |
                          </span>
                          <button
                            type="button"
                            className={styles.filmBtn}
                            onClick={() => onWatchFilm(project.id)}
                            data-cursor-hover
                          >
                            <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
                            </svg>
                            Watch the Film <span className={styles.filmDuration}>{project.filmDuration}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={goNext}
          disabled={activeIndex >= projects.length - 1}
          data-cursor-hover
          aria-label="Next featured project"
        >
          ›
        </button>
      )}

      {multiple && (
        <div className={styles.dots} role="tablist" aria-label="Featured projects">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to featured project ${i + 1}`}
              aria-current={i === activeIndex}
              data-cursor-hover
            />
          ))}
        </div>
      )}
    </div>
  )
}
