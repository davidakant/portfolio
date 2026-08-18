import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import HudBackground from '../components/HudBackground'
import ProjectGrid from '../components/ProjectGrid'
import comfortCaninesPoster from '../assets/projects/ferris-video/ads-videos/comfort-canines-poster.webp'
import creativeOpsScreenshot from '../assets/projects/creativeops-portal/homepage/co-tab1.webp'
import miniGamesScreenshot from '../assets/projects/mini-games/homepage/mg-harbor2.webp'
import styles from './Home.module.css'

// Standalone home-page features — not one of the /work/:slug categories
// below, so their content/links live here rather than in data/projects.js.
// Each film streams directly from its own live site rather than being
// bundled into this repo — embedding actual video files would bloat the
// standalone single-file build considerably for no benefit, since it's the
// same file either way. `filmUrl`/`filmPoster`/`filmDuration` are optional —
// omit them (as both entries below do — neither has a video) and the
// "Watch the Film" button just doesn't render.
const FEATURED_PROJECTS = [
  {
    id: 'creativeops',
    url: 'https://dak-creativeops.netlify.app/',
    image: creativeOpsScreenshot,
    imageAlt:
      'CreativeOps Command Portal dashboard showing the Creative Request Intake form and a live AI Pre-Flight Audit with brief health score',
    tag: 'Creative Operations Dashboard',
    title: 'CreativeOps Command Portal',
    tagline: '"Nothing enters the queue without passing pre-flight."',
    text: 'A concept prototype of a creative operations dashboard for a fictional brand studio: intake with a rules based pre-flight check, designer workload in plain hours, an asset registry, and a four language localization pipeline. Fully interactive with two guided tours, it follows one request through its full lifecycle, with every number computed live.',
    note: 'Fictional concept prototype, built as a portfolio piece for a Creative Operations Manager application. DAK Labs and everything in the dashboard are invented, and nothing is connected to a real system.',
  },
  {
    id: 'minigames',
    url: 'https://dak-minigames.netlify.app/',
    image: miniGamesScreenshot,
    imageAlt:
      'Harbor Pilotage, a 3D sailboat placement puzzle from Mini Games, showing a lighthouse, colored harbor regions, and moored boats',
    tag: 'Puzzle Game Collection',
    title: 'Mini Games',
    tagline: '"Every board is built fresh — you never see the same one twice."',
    text: 'A growing collection of browser puzzle games built for iPad first, desktop second, including Sudoku, word and number puzzles, memory games, and several fully modeled 3D scenes rendered in WebGL. Boards are generated fresh every time, and the logic puzzles are checked for a single solution before they are ever shown to a player.',
    note: 'Personal project, still growing: over a dozen games are playable today, with more logic puzzles in progress.',
  },
]

// The 4 home category tiles are broader groupings than the underlying project
// slugs — each links through to one representative project page. `web-games`
// has no real project yet, so it's a placeholder (see src/data/projects.js).
const HOME_CATEGORIES = [
  { slug: 'web-applications', title: 'Applications' },
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

  const [openFilmId, setOpenFilmId] = useState(null)
  const openFilm = FEATURED_PROJECTS.find((p) => p.id === openFilmId) ?? null
  useEffect(() => {
    if (!openFilmId) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenFilmId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openFilmId])

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
          <span className={styles.featuredProjectEyebrow}>
            FEATURED_PROJECTS // {String(FEATURED_PROJECTS.length).padStart(2, '0')} ENTRIES
          </span>
          <div className={styles.featuredProjectGrid}>
            {FEATURED_PROJECTS.map((project) =>
              project.isPlaceholder ? (
                <motion.div
                  key={project.id}
                  className={styles.featuredProjectPlaceholder}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.featuredProjectPlaceholderLabel}>COMING SOON</span>
                  <p className={styles.featuredProjectPlaceholderText}>A new featured project is on the way.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={project.id}
                  className={styles.featuredProjectCard}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.featuredProjectMedia}
                    data-cursor-hover
                    aria-label={`View ${project.title} live site`}
                  >
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      className={styles.featuredProjectImage}
                      loading="lazy"
                    />
                    <div className={styles.featuredProjectSheen} aria-hidden="true" />
                  </a>
                  <div className={styles.featuredProjectBody}>
                    <span className={styles.featuredProjectTag}>{project.tag}</span>
                    <h2 className={styles.featuredProjectTitle}>{project.title}</h2>
                    <p className={styles.featuredProjectTagline}>{project.tagline}</p>
                    <p className={styles.featuredProjectText}>{project.text}</p>
                    <p className={styles.featuredProjectNote}>{project.note}</p>
                    <div className={styles.featuredProjectCtaRow}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.featuredProjectCta}
                        data-cursor-hover
                      >
                        View Live Site ↗
                      </a>
                      {project.filmUrl && (
                        <>
                          <span className={styles.featuredProjectCtaDivider} aria-hidden="true">
                            |
                          </span>
                          <button
                            type="button"
                            className={styles.featuredProjectFilmBtn}
                            onClick={() => setOpenFilmId(project.id)}
                            data-cursor-hover
                          >
                            <svg className={styles.featuredProjectPlayIcon} viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
                            </svg>
                            Watch the Film{' '}
                            <span className={styles.featuredProjectFilmDuration}>{project.filmDuration}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ),
            )}
          </div>
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
          {openFilm && (
            <motion.div
              className={styles.filmModalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpenFilmId(null)}
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
                  onClick={() => setOpenFilmId(null)}
                  aria-label="Close video"
                  data-cursor-hover
                >
                  ✕
                </button>
                <video
                  key={openFilm.id}
                  className={styles.filmModalVideo}
                  src={openFilm.filmUrl}
                  poster={openFilm.filmPoster}
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
