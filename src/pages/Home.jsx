import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import { FEATURED_PROJECTS, HOME_CATEGORIES } from '../data/home'
import HudBackground from '../components/HudBackground'
import ProjectGrid from '../components/ProjectGrid'
import FeaturedCarousel from '../components/FeaturedCarousel'
import styles from './Home.module.css'

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
              className={`${styles.contactBadge} ${styles.contactBadgeAlt}`}
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
          <FeaturedCarousel projects={FEATURED_PROJECTS} onWatchFilm={setOpenFilmId} />
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
