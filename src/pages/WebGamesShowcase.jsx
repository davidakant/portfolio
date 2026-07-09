import { Link } from 'react-router-dom'
import { useMotionValue } from 'framer-motion'
import {
  getProjectBySlug,
  INTERACTIVE_STORYBOOK_URL,
  UPPERCASE_URL,
  CODE_BREAKER_URL,
  VIDEO_JIGSAW_URL,
} from '../data/projects'
import HudBackground from '../components/HudBackground'
import MediaGallery from '../components/MediaGallery'
import AppDescription from '../components/AppDescription'
import styles from './WebApplicationsShowcase.module.css'

// Section headings that double as external links (their image, via
// MediaGallery's `href` field, already links out too) — anything not listed
// here renders as plain heading text.
const SECTION_LINKS = {
  'Interactive Digital Storybook': INTERACTIVE_STORYBOOK_URL,
  Uppercase: UPPERCASE_URL,
  'Code Breaker': CODE_BREAKER_URL,
  'Video Jigsaw': VIDEO_JIGSAW_URL,
}

// Same bespoke layout as WebApplicationsShowcase (liquid glass panel per
// project, reusing its CSS module directly) rather than the HudShowcase
// viewer. All three sections now have real copy (same intro+bullets+
// description format as the Web Applications page, via the shared
// AppDescription component) — see SECTION_DESCRIPTIONS below.
const STORYBOOK_INTRO =
  'An interactive digital storybook application that combines modern frontend web development with advanced multimedia integration.'

const STORYBOOK_BULLETS = [
  {
    label: 'Interactive User Experience:',
    text: ' Delivers a seamless, engaging reading experience with intuitive page navigation and responsive design optimized for tablets and varied screen sizes.',
  },
  {
    label: 'Multimedia Integration:',
    text: ' Showcases the ability to manage, optimize, and integrate rich visual assets into a cohesive, interactive digital narrative.',
  },
  {
    label: 'Asset Pipeline & Continuity:',
    text: ' Demonstrates the use of modern, AI-driven generative workflows to maintain consistent character designs and art direction across multiple distinct scenes.',
  },
  {
    label: 'Frontend Architecture:',
    text: ' Built using clean web technologies and accessible markup to ensure smooth performance and a polished, user-friendly interface.',
  },
]

const STORYBOOK_NOTE = 'Draft — this is an unfinished, in-progress live project. (as of 07/04/2026)'

// Split around the phrase called out in pink, same pattern as the Web
// Applications page's highlighted phrases.
const STORYBOOK_HIGHLIGHT = {
  before:
    'This web application is an interactive, multimedia digital storybook that merges creative storytelling with modern front-end development. Designed as an engaging and accessible experience for young readers, the application features seamless page navigation, responsive design, and richly integrated visual assets. Behind the scenes, ',
  text: 'the project demonstrates advanced workflows in AI-driven content generation—ensuring strict character continuity and cohesive art direction throughout the narrative',
  after: '.',
}

const UPPERCASE_INTRO =
  'An original, custom-built browser game designed from scratch to deliver a seamless and highly interactive user experience.'

const UPPERCASE_BULLETS = [
  {
    label: 'Full-Lifecycle Development:',
    text: ' Conceptualized, engineered, and deployed a unique standalone game, demonstrating strong product ownership and creative problem-solving.',
  },
  {
    label: 'Dynamic State Management:',
    text: ' Built the underlying logic to flawlessly track real-time user inputs, game progression, and win/loss conditions without any performance drops.',
  },
  {
    label: 'Responsive & Intuitive UI:',
    text: ' Designed a clean, accessible interface that immediately guides the player and adapts seamlessly across different screen sizes and devices.',
  },
  {
    label: 'Frictionless Accessibility:',
    text: ' Engineered as a lightweight web application that runs instantly in the browser, allowing users to play immediately without the need for external software or app downloads.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page and on Web Applications.
const UPPERCASE_HIGHLIGHT = {
  before:
    'This web application is an original browser-based game, conceptualized and built entirely from scratch. Developing a custom game goes beyond standard website design; it requires engineering complex logic to handle instant user interactions, dynamic scoring, and real-time data management. ',
  text: 'Drawing directly from my background in pipeline development, I applied a systematic problem-solving, structuring data and anticipating technical hurdles to keep the application running',
  after:
    '. I designed the interface to be highly responsive and intuitive, ensuring an engaging experience whether the user is on a desktop or a tablet. By taking this project from the initial creative concept to a fully deployed application, it demonstrates my ability to build interactive digital products that balance user experience with efficient code.',
}

const CODE_BREAKER_INTRO =
  'A fully functional digital adaptation of a classic code-breaking game, demonstrating the ability to translate strict logic and rules into a polished web application.'

const CODE_BREAKER_BULLETS = [
  {
    label: 'Precise Rule Execution:',
    text: ' Successfully translated the rigid, pre-existing mechanics of a known game into a custom-engineered digital experience, mimicking a real-world product specification.',
  },
  {
    label: 'Algorithmic Logic:',
    text: ' Built the core feedback loop to instantly and accurately evaluate user inputs against a hidden dataset, calculating complex win/loss conditions on the fly.',
  },
  {
    label: 'Robust State Management:',
    text: ' Engineered the underlying architecture to track and store multiple user attempts, dynamically updating the interface without lag or page reloads.',
  },
  {
    label: 'Responsive UI Design:',
    text: ' Created a clean, intuitive layout that allows users to easily focus on the puzzle, ensuring a frictionless experience across different screen sizes.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page and on Web Applications.
const CODE_BREAKER_HIGHLIGHT = {
  before:
    'This web application is a custom digital adaptation of a classic code-breaking puzzle game. While the original game concept is a familiar classic, the technical execution required translating its strict, pre-defined rules into a seamless browser experience. Developing this required writing precise algorithmic logic to evaluate user guesses against a hidden sequence, instantly returning accurate feedback, and managing the state of the game across multiple attempts. Ultimately, recreating this game was an exercise in ',
  text: 'taking a strict set of predefined rules and translating them',
  after: ' into a reliable, straightforward interface.',
}

const VIDEO_JIGSAW_INTRO =
  'A custom-built interactive jigsaw puzzle where the individual pieces are generated from a live, continuously playing video stream. This was designed specifically for the iPad.'

const VIDEO_JIGSAW_BULLETS = [
  {
    label: 'Multimedia Integration:',
    text: ' Engineered a custom solution using browser canvas tools to slice a live video feed into interlocking, draggable puzzle pieces.',
  },
  {
    label: 'Performance Optimization:',
    text: ' Structured the drawing logic to update the video frames continuously, ensuring smooth playback without lagging or crashing the browser.',
  },
  {
    label: 'Dynamic Interaction:',
    text: ' Built the interface to handle complex drag-and-drop interactions while maintaining the state and position of moving video elements.',
  },
  {
    label: 'Engaging UX:',
    text: ' Transformed a standard programming exercise into a highly interactive, media-rich experience that runs seamlessly on the client side.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const VIDEO_JIGSAW_HIGHLIGHT = {
  before:
    'This web application is an interactive jigsaw puzzle, but with a twist: instead of a static image, the puzzle pieces are sliced from a continuously playing video. Recreating a puzzle with a live video feed is a unique technical challenge. It requires taking the video stream, cutting it into complex interlocking shapes, and constantly updating those pieces so the video keeps playing smoothly, even as you drag them around the screen. Ultimately, ',
  text: 'building this was an exercise in performance optimization',
  after:
    '—managing heavy multimedia processes behind the scenes to ensure the interface remains fast, responsive, and fun to use.',
}

// Keyed by section heading — the shared AppDescription component's props for
// each project write-up that already has real copy. Anything not listed
// here (still a placeholder) falls back to a plain "coming soon" note.
const SECTION_DESCRIPTIONS = {
  'Interactive Digital Storybook': {
    note: STORYBOOK_NOTE,
    intro: STORYBOOK_INTRO,
    bullets: STORYBOOK_BULLETS,
    highlight: STORYBOOK_HIGHLIGHT,
  },
  Uppercase: {
    intro: UPPERCASE_INTRO,
    bullets: UPPERCASE_BULLETS,
    highlight: UPPERCASE_HIGHLIGHT,
  },
  'Code Breaker': {
    intro: CODE_BREAKER_INTRO,
    bullets: CODE_BREAKER_BULLETS,
    highlight: CODE_BREAKER_HIGHLIGHT,
  },
  'Video Jigsaw': {
    intro: VIDEO_JIGSAW_INTRO,
    bullets: VIDEO_JIGSAW_BULLETS,
    highlight: VIDEO_JIGSAW_HIGHLIGHT,
  },
}

export default function WebGamesShowcase() {
  const project = getProjectBySlug('web-games')
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
          <span className={styles.eyebrow}>WEB GAMES // INTERACTIVE ARCHIVE</span>
        </div>

        {project.sections.map((section) => {
          const sectionLink = SECTION_LINKS[section.heading]
          const description = SECTION_DESCRIPTIONS[section.heading]
          return (
            <section key={section.heading} className={styles.section}>
              <div className={styles.panel}>
                <h2 className={styles.sectionHeading}>
                  {sectionLink ? (
                    <a
                      href={sectionLink}
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
                  {description ? (
                    <AppDescription {...description} />
                  ) : (
                    <p className={styles.appDescription}>Description coming soon.</p>
                  )}
                </MediaGallery>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
