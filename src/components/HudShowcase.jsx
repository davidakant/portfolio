import { Fragment, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import ThumbnailRail from './ThumbnailRail'
import ZoomableImage from './ZoomableImage'
import SpatialImage from './SpatialImage'
import HudVideo from './HudVideo'
import VideoEqualizer from './VideoEqualizer'
import HudBorder, { HUD_FRAME_CLIP_PATH } from './HudBorder'
import HudBackground from './HudBackground'
import AudioEqualizer from './AudioEqualizer'
import styles from './HudShowcase.module.css'

// Sci-fi FUI/HUD viewer shared by any project page that wants the same
// holographic panel + category-tab + thumbnail-rail treatment as the
// Architecture page (originally built just for that page, generalized so
// AI Assisted Visuals — and any future project — can reuse it as-is).
//
// `modes` (optional) adds a second, higher-level tab row above the category
// tabs — e.g. AI Assisted Visuals switches between entirely different
// content sets ("Ferris Stills", "Ads", "Conceptual", "Ferris Videos"), each
// with its own categories, where a plain single-level `sections` list isn't
// enough. When omitted, behavior is identical to before (Architecture).
//
// `bordered`/`showTicker`/`dynamicAspect` let a page opt out of the angular
// HUD frame + mask, the data-stream ticker/equalizer, and the fixed-height
// viewer respectively (Architecture uses a plainer, image-shaped viewer;
// AI Assisted Visuals keeps the original full HUD treatment). The liquid-
// glass sheen overlay is independent of `bordered` — it's the panel's own
// glass material, not part of the angular frame decoration, so it always
// renders (just without the frame's clip-path shape when unbordered).
//
// `stackedRails` (e.g. 3D Printing's "Condominium 3D Floorplan" +
// "Miscellaneous") swaps the usual category-tab-chips + single shared rail
// for one labeled ThumbnailRail per category, all visible at once and
// independently scrollable — rather than a tab switching which category's
// rail is shown. Clicking any thumbnail in any rail still drives the same
// single viewer above.
//
// `minimal` (opt-in — Architecture, AI Assisted Visuals, 3D Printing) tones
// down the passive chrome — corner readouts and nav arrows — so the
// photography competes less with the UI. It's additive/visual-only: nothing
// it touches is hover-gated, so touch devices see the exact same (quieter)
// elements at full tap-ability, just dimmer at rest.
export default function HudShowcase({
  slug,
  eyebrow,
  dataStream,
  categoryOrder,
  modes,
  bordered = true,
  showTicker = true,
  dynamicAspect = false,
  stackedRails = false,
  minimal = false,
}) {
  const project = useMemo(() => getProjectBySlug(slug), [slug])
  const [modeIndex, setModeIndex] = useState(0)
  const currentMode = modes ? modes[modeIndex] : null
  const activeSections = currentMode ? currentMode.sections : project.sections

  // By default categories follow projects.js's section order. `categoryOrder`
  // lets a page override that (e.g. Architecture wants Exteriors first in the
  // viewer while keeping Interiors first in the data, since that's used
  // elsewhere as the Home-page card cover image). `fullLabel` keeps the
  // section's full heading (e.g. "Condominium 3D Floorplan") for stacked-rail
  // labels; `label` is the short first-word chip used by the tab/readout.
  const categories = useMemo(() => {
    const bySections = activeSections.map((s) => ({
      label: s.heading.split(' ')[0].toUpperCase(),
      fullLabel: s.heading,
      media: s.media,
    }))
    if (!categoryOrder) return bySections
    const byLabel = new Map(bySections.map((c) => [c.label, c]))
    const ordered = categoryOrder.map((label) => byLabel.get(label)).filter(Boolean)
    bySections.forEach((c) => {
      if (!categoryOrder.includes(c.label)) ordered.push(c)
    })
    return ordered
  }, [activeSections, categoryOrder])

  const [catIndex, setCatIndex] = useState(0)
  const [index, setIndex] = useState(0)

  const media = categories[catIndex].media
  const active = media[index]

  const selectMode = useCallback((i) => {
    setModeIndex(i)
    setCatIndex(0)
    setIndex(0)
  }, [])

  const selectCategory = useCallback((i) => {
    setCatIndex(i)
    setIndex(0)
  }, [])

  // Stacked-rails mode: a thumbnail click needs to pick both which
  // category's rail it came from and its position within that rail,
  // directly — unlike selectCategory, it doesn't reset to index 0.
  const selectMedia = useCallback((catIdx, mediaIdx) => {
    setCatIndex(catIdx)
    setIndex(mediaIdx)
  }, [])

  const step = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + media.length) % media.length)
    },
    [media.length],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  useEffect(() => {
    setSpatialEnabled(false)
    setVideoPlaying(false)
  }, [active.src])

  // Mouse-driven motion for the whole display: tilts the glass panel and,
  // via HudBackground, parallaxes the background grid/glyphs at a different
  // rate — one shared motion source instead of two independent trackers.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 20 })

  // Only tracked for `dynamicAspect` pages — sizes the viewer box to match
  // whatever's currently displayed instead of a fixed-height crop. Kept
  // across src changes (not reset to null) so the box doesn't collapse for
  // the instant before the next item's load event fires.
  const [naturalSize, setNaturalSize] = useState({ w: 16, h: 9 })
  const handleNaturalSize = useCallback((w, h) => {
    if (w && h) setNaturalSize({ w, h })
  }, [])

  // "Spatial photo" parallax view — only available on images with a
  // precomputed depth map (see `depthSrc` in projects.js). Off by default;
  // resets whenever the displayed image changes so it never silently stays
  // on for an image that doesn't support it.
  const [spatialEnabled, setSpatialEnabled] = useState(false)

  // Shared with HudVideo (owns the actual <video> element) and VideoEqualizer
  // (attaches a Web Audio analyser to it). `videoPlaying` flips true from
  // HudVideo's play-button click handler — the same synchronous user
  // gesture VideoEqualizer's AudioContext needs to not start suspended.
  const videoRef = useRef(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const handleVideoPlay = useCallback(() => setVideoPlaying(true), [])

  const panelInnerRef = useRef(null)
  const handleMouseMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }
  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className={`${styles.holo} ${minimal ? styles.minimal : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HudBackground mx={mx} my={my} />
      <div className={styles.ambient} aria-hidden="true" />

      <div className={`${styles.chrome} container`}>
        <Link to="/" className={styles.back} data-cursor-hover>
          ← HOME
        </Link>

        {modes && (
          <div className={styles.modeTabs}>
            {modes.map((m, i) => {
              const isFerris = m.label === 'Ferris Videos' || m.label === 'Ferris Stills'
              const prevIsFerris = i > 0 && (modes[i - 1].label === 'Ferris Videos' || modes[i - 1].label === 'Ferris Stills')
              // One-time divider where the "serious work" (magenta) modes give
              // way to the "just for fun" (green) ones — a gradient that
              // itself fades from magenta to green, echoing the two groups it
              // separates.
              const showDivider = isFerris && !prevIsFerris
              return (
                <Fragment key={m.label}>
                  {showDivider && <span className={styles.modeTabsDivider} aria-hidden="true" />}
                  <button
                    className={`${styles.modeTab} ${isFerris ? styles.modeTabGreen : ''} ${i === modeIndex ? styles.modeTabActive : ''}`}
                    style={{ '--tab-delay': `${(i % 4) * 0.6}s` }}
                    onClick={() => selectMode(i)}
                    data-cursor-hover
                  >
                    <span className={styles.badgeLabel}>
                      {m.label}
                      {isFerris && <span className={styles.badgeSubLabel}>(my dog)</span>}
                    </span>
                  </button>
                </Fragment>
              )
            })}
          </div>
        )}

        <div className={styles.headRow}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          {categories.length > 1 && !stackedRails && (
            <div className={styles.tabs}>
              {categories.map((c, i) => (
                <button
                  key={c.label}
                  className={`${styles.tab} ${i === catIndex ? styles.tabActive : ''}`}
                  style={{ '--tab-delay': `${(i % 4) * 0.6}s` }}
                  onClick={() => selectCategory(i)}
                  data-cursor-hover
                >
                  <span className={styles.badgeLabel}>{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.stage}>
          <motion.div
            className={styles.panel}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
          >
            <div
              className={`${styles.panelInner} ${dynamicAspect ? styles.panelInnerDynamic : ''}`}
              style={dynamicAspect ? { '--ratio': `${naturalSize.w} / ${naturalSize.h}` } : undefined}
              ref={panelInnerRef}
            >
              <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => step(-1)} data-cursor-hover aria-label="Previous">
                ‹
              </button>
              <button className={`${styles.navBtn} ${styles.navNext}`} onClick={() => step(1)} data-cursor-hover aria-label="Next">
                ›
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.src}
                  className={styles.imageWrap}
                  style={{ clipPath: bordered ? HUD_FRAME_CLIP_PATH : 'none' }}
                  initial={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {active.type === 'video' ? (
                    <HudVideo
                      src={active.src}
                      poster={active.poster}
                      caption={currentMode?.showCaption ? active.caption : undefined}
                      videoRef={videoRef}
                      onPlay={handleVideoPlay}
                      onNaturalSize={dynamicAspect ? handleNaturalSize : undefined}
                    />
                  ) : active.depthSrc && spatialEnabled ? (
                    <SpatialImage
                      src={active.src}
                      depthSrc={active.depthSrc}
                      alt={active.alt}
                      mx={mx}
                      my={my}
                      onNaturalSize={dynamicAspect ? handleNaturalSize : undefined}
                    />
                  ) : (
                    <ZoomableImage
                      src={active.src}
                      alt={active.alt}
                      containerRef={panelInnerRef}
                      onNaturalSize={dynamicAspect ? handleNaturalSize : undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div
                className={styles.glassSheen}
                style={{ clipPath: bordered ? HUD_FRAME_CLIP_PATH : 'none' }}
                aria-hidden="true"
              />

              <div className={styles.readoutTL}>
                {active.type === 'video' ? 'VID_' : 'IMG_'}
                {String(index + 1).padStart(3, '0')} / {String(media.length).padStart(3, '0')}
              </div>
              <div className={styles.topRightStack}>
                <div className={styles.readoutTR}>{categories[catIndex].label}</div>
                {active.type === 'video' && <VideoEqualizer videoRef={videoRef} playing={videoPlaying} />}
              </div>

              {active.depthSrc && (
                <button
                  className={`${styles.spatialToggle} ${spatialEnabled ? styles.spatialToggleActive : ''}`}
                  onClick={() => setSpatialEnabled((v) => !v)}
                  data-cursor-hover
                >
                  <span className={styles.badgeLabel}>
                    {spatialEnabled ? '◉ SPATIAL ON' : '○ SPATIAL OFF'}
                  </span>
                </button>
              )}
            </div>

            {bordered && <HudBorder color="#7ffcff" className={styles.hudBorder} />}
          </motion.div>
        </div>

        {showTicker && (
          <div className={styles.dataStream} aria-hidden="true">
            <div className={styles.dataStreamTrack}>{dataStream.repeat(4)}</div>
            <AudioEqualizer />
          </div>
        )}

        {stackedRails ? (
          <div className={styles.stackedRails}>
            {categories.map((c, catIdx) => (
              <div key={c.fullLabel} className={styles.railGroup}>
                <span className={styles.railLabel}>{c.fullLabel}</span>
                <ThumbnailRail
                  media={c.media}
                  activeIndex={catIdx === catIndex ? index : -1}
                  onSelect={(i) => selectMedia(catIdx, i)}
                />
              </div>
            ))}
          </div>
        ) : (
          <ThumbnailRail key={`${modeIndex}-${catIndex}`} media={media} activeIndex={index} onSelect={setIndex} />
        )}
      </div>
    </div>
  )
}
