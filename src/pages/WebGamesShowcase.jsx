import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValue } from 'framer-motion'
import {
  getProjectBySlug,
  MINI_GAMES_URL,
  INTERACTIVE_STORYBOOK_URL,
  SPOT_THE_DIFFERENCE_URL,
  UPPERCASE_URL,
  CODE_BREAKER_URL,
  VIDEO_JIGSAW_URL,
} from '../data/projects'
import HudBackground from '../components/HudBackground'
import MediaGallery from '../components/MediaGallery'
import AppDescription from '../components/AppDescription'
import styles from './WebApplicationsShowcase.module.css'

const slugify = (heading) => heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Section headings that double as external links (their image, via
// MediaGallery's `href` field, already links out too) — anything not listed
// here renders as plain heading text.
const SECTION_LINKS = {
  'Mini Games': MINI_GAMES_URL,
  'Interactive Digital Storybook': INTERACTIVE_STORYBOOK_URL,
  'Spot the Difference': SPOT_THE_DIFFERENCE_URL,
  Uppercase: UPPERCASE_URL,
  'Code Breaker': CODE_BREAKER_URL,
  'Video Jigsaw': VIDEO_JIGSAW_URL,
}

// Same bespoke layout as WebApplicationsShowcase (liquid glass panel per
// project, reusing its CSS module directly) rather than the HudShowcase
// viewer. All three sections now have real copy (same intro+bullets+
// description format as the Applications page, via the shared
// AppDescription component) — see SECTION_DESCRIPTIONS below.
const STORYBOOK_INTRO =
  'Designed primarily for iPad, this is an interactive digital storybook application that combines modern frontend web development with advanced multimedia integration.'

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

// Split around the phrase called out in pink, same pattern as the Web
// Applications page's highlighted phrases.
const STORYBOOK_HIGHLIGHT = {
  before:
    'This application is an interactive, multimedia digital storybook that merges creative storytelling with modern front-end development. Designed as an engaging and accessible experience for young readers, the application features seamless page navigation, responsive design, and richly integrated visual assets. Behind the scenes, ',
  text: 'the project demonstrates advanced workflows in AI-driven content generation—ensuring strict character continuity and cohesive art direction throughout the narrative',
  after: '.',
}

const SPOT_THE_DIFFERENCE_INTRO =
  'A browser-based spot-the-difference game built around illustrated puzzle collections, each hiding ten differences between two nearly identical images.'

const SPOT_THE_DIFFERENCE_BULLETS = [
  {
    label: 'Multiple Collections:',
    text: ' Organizes dozens of AI-generated puzzle images into themed, unlockable collections, with more added over time.',
  },
  {
    label: 'Touch-Friendly Precision:',
    text: ' Supports pinch-to-zoom, drag-to-pan, and double-tap-to-reset, so spotting a small difference works as well on a phone as a desktop.',
  },
  {
    label: 'Persistent Progress:',
    text: " Tracks stars found per collection using the browser's built-in storage, so progress carries over between visits.",
  },
  {
    label: 'Anti-Spam Safeguard:',
    text: ' Enforces a short cooldown after every tap—longer after a wrong guess—so players can\'t rapid-fire their way through a puzzle.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const SPOT_THE_DIFFERENCE_HIGHLIGHT = {
  before:
    'This application is a browser-based spot-the-difference game built around dozens of AI-generated puzzle images, organized into unlockable collections. Each puzzle presents two nearly identical illustrations side by side, and the player taps to flag each of ten hidden differences, with a star lighting up per find and progress saved automatically between sessions. Pinch-to-zoom and drag-to-pan support make it just as playable on a phone as a desktop. To keep the game fair, ',
  text: 'a short cooldown after every tap—longer after a wrong guess—stops players from rapid-fire guessing their way through a puzzle',
  after: ', so finding a difference actually requires looking for it.',
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
    text: ' Engineered as a lightweight application that runs instantly in the browser, allowing users to play immediately without the need for external software or app downloads.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page and on Applications.
const UPPERCASE_HIGHLIGHT = {
  before:
    'This application is an original browser-based game, conceptualized and built entirely from scratch. Developing a custom game goes beyond standard website design; it requires engineering complex logic to handle instant user interactions, dynamic scoring, and real-time data management. ',
  text: 'Drawing directly from my background in pipeline development, I applied a systematic problem-solving, structuring data and anticipating technical hurdles to keep the application running',
  after:
    '. I designed the interface to be highly responsive and intuitive, ensuring an engaging experience whether the user is on a desktop or a tablet. By taking this project from the initial creative concept to a fully deployed application, it demonstrates my ability to build interactive digital products that balance user experience with efficient code.',
}

const CODE_BREAKER_INTRO =
  'A fully functional digital adaptation of a classic code-breaking game, demonstrating the ability to translate strict logic and rules into a polished application.'

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
// highlighted phrases on this page and on Applications.
const CODE_BREAKER_HIGHLIGHT = {
  before:
    'This application is a custom digital adaptation of a classic code-breaking puzzle game. While the original game concept is a familiar classic, the technical execution required translating its strict, pre-defined rules into a seamless browser experience. Developing this required writing precise algorithmic logic to evaluate user guesses against a hidden sequence, instantly returning accurate feedback, and managing the state of the game across multiple attempts. Ultimately, recreating this game was an exercise in ',
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
    'This application is an interactive jigsaw puzzle, but with a twist: instead of a static image, the puzzle pieces are sliced from a continuously playing video. Recreating a puzzle with a live video feed is a unique technical challenge. It requires taking the video stream, cutting it into complex interlocking shapes, and constantly updating those pieces so the video keeps playing smoothly, even as you drag them around the screen. Ultimately, ',
  text: 'building this was an exercise in performance optimization',
  after:
    '—managing heavy multimedia processes behind the scenes to ensure the interface remains fast, responsive, and fun to use.',
}

const MINI_GAMES_INTRO =
  'A growing collection of browser puzzle games built for iPad first and desktop second, from Sudoku and Kakuro to several fully modeled 3D scenes.'

const MINI_GAMES_BULLETS = [
  {
    label: 'Provably Fair Puzzles:',
    text: ' Generates every board fresh with a seeded random number generator, and the logic puzzles are checked by a solver for exactly one solution before they are ever shown to a player.',
  },
  {
    label: '3D Scenes Built From Scratch:',
    text: ' Several games render in full WebGL, with orbiting cameras, baked lighting, and no textures anywhere, since every surface detail is built as real geometry.',
  },
  {
    label: 'Taught, Not Just Explained:',
    text: ' Every game ships a Rule Book, and several also play themselves through a scripted tutorial that narrates each move against the live board.',
  },
  {
    label: 'No Framework, No Backend:',
    text: ' Built as plain ES modules with zero runtime dependencies, installable to the iPad home screen, and playable fully offline.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const MINI_GAMES_HIGHLIGHT = {
  before:
    'This application is a growing collection of browser puzzle games, from familiar logic puzzles like Sudoku and Kakuro to several fully modeled 3D scenes rendered in WebGL, with orbiting cameras and baked lighting. Built for iPad first, ',
  text: 'every board is generated fresh with a seeded random number generator, and the logic puzzles are checked by a solver for exactly one solution before a player ever sees them',
  after: ', so no puzzle here can be unsolvable or ambiguous.',
}

// Keyed by section heading — the shared AppDescription component's props for
// each project write-up that already has real copy. Anything not listed
// here (still a placeholder) falls back to a plain "coming soon" note.
const SECTION_DESCRIPTIONS = {
  'Mini Games': {
    intro: MINI_GAMES_INTRO,
    bullets: MINI_GAMES_BULLETS,
    highlight: MINI_GAMES_HIGHLIGHT,
  },
  'Interactive Digital Storybook': {
    intro: STORYBOOK_INTRO,
    bullets: STORYBOOK_BULLETS,
    highlight: STORYBOOK_HIGHLIGHT,
  },
  'Spot the Difference': {
    intro: SPOT_THE_DIFFERENCE_INTRO,
    bullets: SPOT_THE_DIFFERENCE_BULLETS,
    highlight: SPOT_THE_DIFFERENCE_HIGHLIGHT,
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

  const [activeId, setActiveId] = useState(() => slugify(project.sections[0]?.heading ?? ''))
  const sectionEls = useRef({})
  const pageHeaderRef = useRef(null)

  // Scroll-spy for the TOC: whichever section is crossing a thin band near
  // the vertical center of the viewport gets the active highlight.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    Object.values(sectionEls.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Plain `href="#id"` anchors would be hijacked by the standalone build's
  // HashRouter (routes like #/work/web-games) as a route-change attempt —
  // the browser tries to navigate to a nonexistent page instead of jumping
  // to the section, which reads as the whole app going blank. Doing the
  // scroll in JS and never touching location.hash sidesteps that entirely;
  // href stays for keyboard/right-click/semantics.
  //
  // Offset is computed live rather than via a fixed scroll-margin, since the
  // header's actual height varies (the .toc list can wrap differently) and
  // it's only sticky/overlapping at all on desktop — on mobile it's static
  // and scrolls away, so only Nav's ~60px needs clearing there. Landing
  // exactly at the section's top means the last section (near the bottom of
  // the page) may not be able to scroll that far; window.scrollTo naturally
  // clamps to the page's max scroll instead of overshooting.
  const jumpTo = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const header = pageHeaderRef.current
    const isStuck = header && getComputedStyle(header).position === 'sticky'
    const offset = 60 + (isStuck ? header.getBoundingClientRect().height : 0)
    const targetTop = target.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: targetTop - offset, behavior: 'smooth' })
  }

  return (
    <div className={styles.holo} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <HudBackground mx={mx} my={my} />
      <div className={styles.ambient} aria-hidden="true" />

      <div className={`${styles.chrome} container`}>
        <div className={styles.pageHeader} ref={pageHeaderRef}>
          <Link to="/" className={styles.back} data-cursor-hover>
            ← HOME
          </Link>

          <span className={styles.eyebrow}>WEB GAMES // INTERACTIVE ARCHIVE</span>

          <nav className={styles.toc} aria-label="Games on this page">
            <span className={styles.tocLabel}>On this page:</span>
            <ul className={styles.tocList}>
              {project.sections.map((section) => {
                const id = slugify(section.heading)
                return (
                  <li key={section.heading}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => jumpTo(e, id)}
                      className={styles.tocLink}
                      aria-current={activeId === id ? 'true' : undefined}
                      data-cursor-hover
                    >
                      {section.heading}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {project.sections.map((section) => {
          const sectionLink = SECTION_LINKS[section.heading]
          const description = SECTION_DESCRIPTIONS[section.heading]
          return (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              ref={(el) => {
                sectionEls.current[slugify(section.heading)] = el
              }}
              className={styles.section}
            >
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
