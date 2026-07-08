import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import HudBackground from '../components/HudBackground'
import ProjectGrid from '../components/ProjectGrid'
import caletaScreenshot from '../assets/projects/caleta-residences/homepage/caleta-screenshot.webp'
import comfortCaninesPoster from '../assets/projects/ferris-video/ads-videos/comfort-canines-poster.webp'
import styles from './Home.module.css'

// Standalone home-page feature — not one of the /work/:slug categories below,
// so its content/link lives here rather than in data/projects.js. The film
// streams directly from the live Caleta site rather than being bundled into
// this repo — embedding an actual video file would bloat the standalone
// single-file build considerably for no benefit, since it's the same file
// either way.
const CALETA_URL = 'https://caletaresidences.netlify.app/'
const CALETA_FILM_URL = 'https://caletaresidences.netlify.app/assets/video/caleta-film.mp4'
const CALETA_FILM_POSTER = 'https://caletaresidences.netlify.app/assets/video/caleta-film-poster.webp'

// The 4 home category tiles are broader groupings than the underlying project
// slugs — each links through to one representative project page. `web-games`
// has no real project yet, so it's a placeholder (see src/data/projects.js).
const HOME_CATEGORIES = [
  { slug: 'web-applications', title: 'Web Applications' },
  { slug: 'architecture', title: 'Architectural Visualization' },
  { slug: 'ferris-video', title: 'AI Assisted Visuals', cover: comfortCaninesPoster },
  { slug: 'web-games', title: 'Web Games' },
  { slug: '3d-printing', title: '3D Printing' },
]

const homeCards = HOME_CATEGORIES.map(({ slug, title, cover }) => ({
  ...getProjectBySlug(slug),
  title,
  ...(cover ? { cover } : {}),
}))

const EMAIL = 'david.a.kant@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/davidakant'
const LINKEDIN_LABEL = 'www.linkedin.com/in/davidakant'

const SKILL_LINES = [
  'Pipeline Development // Scripting | Workflow Optimization | Asset Management',
  'Project Management // Process Improvement | Stakeholder Communication | Quality Assurance',
  'Design & Visualization // Architecture | 2D & 3D Graphics | AI-Assisted Visualization',
]

export default function Home() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const handleMouseMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }
  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const [filmOpen, setFilmOpen] = useState(false)
  useEffect(() => {
    if (!filmOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setFilmOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filmOpen])

  return (
    <div className={styles.holo} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <HudBackground mx={mx} my={my} />
      <div className={styles.ambient} aria-hidden="true" />

      <div className={`${styles.chrome} container`}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>DAVID KANT // PORTFOLIO_INDEX</span>
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            David Kant
          </motion.h1>
          <motion.div
            className={styles.contactRow}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={`mailto:${EMAIL}`} className={styles.contactBadge} data-cursor-hover>
              <span className={styles.badgeLabel}>Email: {EMAIL}</span>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.contactBadge} ${styles.contactBadgeMagenta}`}
              data-cursor-hover
            >
              <span className={styles.badgeLabel}>LinkedIn: {LINKEDIN_LABEL}</span>
            </a>
          </motion.div>
          <motion.div
            className={styles.skillLines}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {SKILL_LINES.map((line, i) => (
              <span
                key={line}
                className={styles.skillLine}
                data-text={line}
                style={{ '--glitch-delay': `${i * 1.7}s` }}
              >
                {line}
              </span>
            ))}
          </motion.div>
        </section>

        <section className={styles.featuredProjectSection}>
          <span className={styles.featuredProjectEyebrow}>FEATURED_PROJECT // ARCHITECTURAL VISUALIZATION</span>
          <motion.div
            className={styles.featuredProjectCard}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={CALETA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.featuredProjectMedia}
              data-cursor-hover
              aria-label="View Caleta — Private Island Residences live site"
            >
              <img
                src={caletaScreenshot}
                alt="Caleta — Private Island Residences homepage hero"
                className={styles.featuredProjectImage}
                loading="lazy"
              />
              <div className={styles.featuredProjectSheen} aria-hidden="true" />
            </a>
            <div className={styles.featuredProjectBody}>
              <h2 className={styles.featuredProjectTitle}>Caleta — Private Island Residences</h2>
              <p className={styles.featuredProjectTagline}>"Low-rise living. Boundless island."</p>
              <p className={styles.featuredProjectText}>
                A ten-story, fifty-residence ultra-luxury condominium concept set on a 216-acre private
                island — architecture, AI-assisted visualization, brand identity, and the full marketing
                site, designed and built end-to-end.
              </p>
              <p className={styles.featuredProjectNote}>
                Fictional development — AI-assisted architecture, renders, and brand, created for
                portfolio demonstration only.
              </p>
              <div className={styles.featuredProjectCtaRow}>
                <a
                  href={CALETA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.featuredProjectCta}
                  data-cursor-hover
                >
                  View Live Site ↗
                </a>
                <span className={styles.featuredProjectCtaDivider} aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  className={styles.featuredProjectFilmBtn}
                  onClick={() => setFilmOpen(true)}
                  data-cursor-hover
                >
                  <svg className={styles.featuredProjectPlayIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
                  </svg>
                  Watch the Film <span className={styles.featuredProjectFilmDuration}>1:22</span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className={styles.featured}>
          <span className={styles.featuredEyebrow}>
            SELECTED_WORK // {String(homeCards.length).padStart(2, '0')} ENTRIES
          </span>
          <ProjectGrid projects={homeCards} mx={mx} my={my} />
        </section>
      </div>

      {/* Rendered via portal to document.body — .chrome's `position:relative;
          z-index:2` forms its own stacking context, which would otherwise
          cap this modal below Nav's z-index:100 regardless of its own
          z-index value. Portaling out of that subtree is the real fix. */}
      {createPortal(
        <AnimatePresence>
          {filmOpen && (
            <motion.div
              className={styles.filmModalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setFilmOpen(false)}
            >
              <motion.div
                className={styles.filmModalPanel}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.filmModalClose}
                  onClick={() => setFilmOpen(false)}
                  aria-label="Close video"
                  data-cursor-hover
                >
                  ✕
                </button>
                <video
                  className={styles.filmModalVideo}
                  src={CALETA_FILM_URL}
                  poster={CALETA_FILM_POSTER}
                  controls
                  playsInline
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
