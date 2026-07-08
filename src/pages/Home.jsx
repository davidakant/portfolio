import { motion, useMotionValue } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import HudBackground from '../components/HudBackground'
import ProjectGrid from '../components/ProjectGrid'
import caletaScreenshot from '../assets/projects/caleta-residences/homepage/caleta-screenshot.webp'
import styles from './Home.module.css'

// Standalone home-page feature — not one of the /work/:slug categories below,
// so its content/link lives here rather than in data/projects.js.
const CALETA_URL = 'https://caletaresidences.netlify.app/'

// The 4 home category tiles are broader groupings than the underlying project
// slugs — each links through to one representative project page. `web-games`
// has no real project yet, so it's a placeholder (see src/data/projects.js).
const HOME_CATEGORIES = [
  { slug: 'web-applications', title: 'Web Applications' },
  { slug: 'architecture', title: 'Architectural Visualization' },
  { slug: 'ferris-video', title: 'AI Generated Visuals' },
  { slug: 'web-games', title: 'Web Games' },
  { slug: '3d-printing', title: '3D Printing' },
]

const homeCards = HOME_CATEGORIES.map(({ slug, title }) => ({
  ...getProjectBySlug(slug),
  title,
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
          <motion.a
            href={CALETA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.featuredProjectCard}
            data-cursor-hover
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.featuredProjectMedia}>
              <img
                src={caletaScreenshot}
                alt="Caleta — Private Island Residences homepage hero"
                className={styles.featuredProjectImage}
                loading="lazy"
              />
              <div className={styles.featuredProjectSheen} aria-hidden="true" />
            </div>
            <div className={styles.featuredProjectBody}>
              <h2 className={styles.featuredProjectTitle}>Caleta — Private Island Residences</h2>
              <p className={styles.featuredProjectTagline}>"Low-rise living. Boundless island."</p>
              <p className={styles.featuredProjectText}>
                A ten-story, fifty-residence ultra-luxury condominium concept set on a 216-acre private
                island — architecture, AI-generated visualization, brand identity, and the full marketing
                site, designed and built end-to-end.
              </p>
              <p className={styles.featuredProjectNote}>
                Fictional development — AI-generated architecture, renders, and brand, created for
                portfolio demonstration only.
              </p>
              <span className={styles.featuredProjectCta}>View Live Site ↗</span>
            </div>
          </motion.a>
        </section>

        <section className={styles.featured}>
          <span className={styles.featuredEyebrow}>
            SELECTED_WORK // {String(homeCards.length).padStart(2, '0')} ENTRIES
          </span>
          <ProjectGrid projects={homeCards} mx={mx} my={my} />
        </section>
      </div>
    </div>
  )
}
