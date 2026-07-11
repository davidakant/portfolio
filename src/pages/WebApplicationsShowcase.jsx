import { Link } from 'react-router-dom'
import { useMotionValue } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import HudBackground from '../components/HudBackground'
import MediaGallery from '../components/MediaGallery'
import AppDescription from '../components/AppDescription'
import styles from './WebApplicationsShowcase.module.css'

// Unlike Architecture/AI Visuals, this page doesn't use the HudShowcase
// viewer+thumbnail-rail+category-tabs — with only one screenshot per app,
// that mechanism was overkill (dead nav arrows, a rail with a single
// thumbnail). Instead this reuses the same HUD chrome (background, back
// link, eyebrow, fonts/colors) around a plain MediaGallery grid per section,
// same as the original pre-redesign layout.
// Opening sentence, then one bullet per labeled callout (bold label rendered
// via <strong>), then a final labeled "Description" paragraph set apart by
// extra space below the bullet list.
const REALTOR_INTRO =
  'This location intelligence application aggregates real-world data from nearly a dozen public and government sources to provide instant, comprehensive property and demographic insights.'

const REALTOR_BULLETS = [
  {
    label: 'Instant Property Profiles:',
    text: ' Users can search any Pennsylvania address to instantly view ownership, zoning, tax assessments, utility providers, and broadband availability.',
  },
  {
    label: 'Integrated Visuals:',
    text: ' Data is contextualized with interactive parcel boundaries, 3D satellite imagery, and street-level photography.',
  },
  {
    label: 'Demographic Tools:',
    text: ' A dedicated module surfaces vital Census data—including population and income metrics—for any state, county, or neighborhood.',
  },
  {
    label: 'The Technical Challenge:',
    text: ' The core achievement of the application is data normalization—successfully standardizing disparate, inconsistently formatted data from nine different county systems into a single, seamless user interface.',
  },
]

// Split around the phrase called out in pink — the page's one deliberate
// accent use, everything else is white/cyan — so it renders as a
// highlighted <span>.
const REALTOR_HIGHLIGHT = {
  before:
    'This application is a comprehensive location intelligence tool that instantly aggregates real-world data from nearly a dozen public and government sources. Users can search any city for live weather updates, or enter a Pennsylvania address to unlock detailed property insights—including ownership, zoning, tax assessments, utility providers, and broadband access. These insights are paired with interactive parcel maps, 3D satellite imagery, and street-level photos to provide a complete picture of the location. Additionally, a built-in demographic tool offers quick access to Census data, such as population and income, for any state, county, or neighborhood. Behind the scenes, ',
  text: 'the application solves a complex data-engineering challenge: seamlessly standardizing and unifying fragmented information from multiple incompatible databases',
  after: '—including nine distinct county systems—into a single, user-friendly interface.',
}

const PROJECT_MANAGEMENT_NOTE =
  'NOTE: This app is designed to operate on a local network with local cache. This is for demonstration only, and most operational functionailty will not work. It has been populated with simulated data.'

const PROJECT_MANAGEMENT_INTRO =
  'A self-contained project management dashboard built to centralize construction workflows from initial charter to final closeout.'

const PROJECT_MANAGEMENT_BULLETS = [
  {
    label: 'Centralized Workflow:',
    text: ' Consolidates scheduling, budget tracking, document storage (photos/drawings), team contacts, and a final walkthrough checklist into a single interface.',
  },
  {
    label: 'At-a-Glance Reporting:',
    text: ' Provides an instant, top-level summary of project health, including budget utilization and task completion.',
  },
  {
    label: 'Lightweight Architecture:',
    text: ' Engineered to run entirely client-side without external servers or SaaS dependencies.',
  },
  {
    label: 'Persistent Data:',
    text: " Leverages the browser's built-in storage architecture to securely save, manage, and reload all project data across sessions.",
  },
]

// Same pattern as REALTOR_HIGHLIGHT — split around the one phrase called out
// in pink.
const PROJECT_MANAGEMENT_HIGHLIGHT = {
  before:
    'This interactive dashboard is a comprehensive, all-in-one tool designed to manage a construction project through its entire lifecycle. It centralizes essential project workflows—including scheduling, budget tracking, team directories, document management for photos and drawings, and a final closeout punch list—into a single, at-a-glance interface. To ensure the application remains lightweight and highly accessible, ',
  text: 'it was engineered to run entirely within the web browser. Without relying on external servers or costly software subscriptions',
  after:
    ", the dashboard successfully saves and retrieves all project data using the browser's built-in storage architecture, ensuring progress is never lost.",
}

const PROJECT_COORDINATION_NOTE =
  'NOTE: This front-end app is designed to operate with local cache. This is for demonstration only. There is no database, no login, and no email actually sent. Refreshing the page resets every module back to its starting data. Client names, product lines, batch numbers, meeting notes, and message copy are all realistic placeholder content.'

const PROJECT_COORDINATION_INTRO =
  'A custom-built project coordination dashboard designed to streamline the daily workflows and administrative tasks of a Project Coordinator for Account Management, Production Scheduling, and Administrative Support.'

const PROJECT_COORDINATION_BULLETS = [
  {
    label: 'Centralized Operations:',
    text: ' Consolidates task tracking, timeline management, and stakeholder organization into a single, easy-to-read interface.',
  },
  {
    label: 'Workflow Optimization:',
    text: ' Applies pipeline development principles to organize complex, overlapping project data into clear, actionable steps.',
  },
  {
    label: 'Practical Utility:',
    text: ' Engineered specifically to handle the real-world operational challenges of managing cross-functional projects.',
  },
  {
    label: 'Intuitive UI/UX:',
    text: ' Features a clean, accessible layout that allows users to quickly assess project health and prioritize daily tasks without unnecessary friction.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const PROJECT_COORDINATION_HIGHLIGHT = {
  before:
    'This application is a custom dashboard I built to simulate and streamline the daily tasks of a solo project coordinator. It serves as a centralized hub for managing timelines, tracking tasks, and organizing stakeholder communication. Using my experience in pipeline development, I designed the interface to take ',
  text: 'complex, overlapping project data and turn it into a clear, actionable workflow',
  after:
    '. Building this tool was a practical exercise in applying technical problem-solving to real-world administrative challenges, resulting in a straightforward interface that keeps projects organized and moving forward.',
}

// Keyed by section heading (rather than array index) so reordering
// `sections` in projects.js can't silently mismatch a section with the
// wrong write-up — same pattern as WebGamesShowcase's SECTION_DESCRIPTIONS.
const SECTION_DESCRIPTIONS = {
  'Project Coordination': {
    note: PROJECT_COORDINATION_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: PROJECT_COORDINATION_INTRO,
    bullets: PROJECT_COORDINATION_BULLETS,
    highlight: PROJECT_COORDINATION_HIGHLIGHT,
  },
  'Project Management': {
    note: PROJECT_MANAGEMENT_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: PROJECT_MANAGEMENT_INTRO,
    bullets: PROJECT_MANAGEMENT_BULLETS,
    highlight: PROJECT_MANAGEMENT_HIGHLIGHT,
  },
  'Realtor Dashboard': {
    intro: REALTOR_INTRO,
    bullets: REALTOR_BULLETS,
    highlight: REALTOR_HIGHLIGHT,
  },
}

export default function WebApplicationsShowcase() {
  const project = getProjectBySlug('web-applications')
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
        <Link to="/" className={styles.back} data-cursor-hover>
          ← HOME
        </Link>

        <div className={styles.headRow}>
          <span className={styles.eyebrow}>APPLICATIONS // PRODUCTIVITY ARCHIVE</span>
        </div>

        {project.sections.map((section) => {
          const link = section.media[0]?.href
          const description = SECTION_DESCRIPTIONS[section.heading]
          return (
            <section key={section.heading} className={styles.section}>
              <div className={styles.panel}>
                <h2 className={styles.sectionHeading}>
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sectionHeadingLink}
                      data-cursor-hover
                    >
                      {section.heading}
                    </a>
                  ) : (
                    section.heading
                  )}
                </h2>
                <MediaGallery media={section.media}>
                  {description && <AppDescription {...description} />}
                </MediaGallery>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
