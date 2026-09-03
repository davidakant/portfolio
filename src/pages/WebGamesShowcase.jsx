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
  'An interactive digital storybook built for the iPad, pairing AI-generated illustration with a hand-built reading interface.'

const STORYBOOK_BULLETS = [
  {
    label: 'Reading Experience:',
    text: ' Page navigation that works by touch, with a layout that adapts to tablets and other screen sizes.',
  },
  {
    label: 'Multimedia Integration:',
    text: ' Rich visual assets managed, optimized, and assembled into one continuous story.',
  },
  {
    label: 'Character Continuity:',
    text: ' AI-driven generative workflows kept the characters and the art direction consistent from one scene to the next.',
  },
  {
    label: 'Front-End Build:',
    text: ' Plain web technologies and accessible markup, so it runs smoothly and stays easy to use.',
  },
]

// Split around the phrase called out in pink, same pattern as the Web
// Applications page's highlighted phrases.
const STORYBOOK_HIGHLIGHT = {
  before:
    'This is an interactive, multimedia digital storybook for young readers. It has page navigation built for touch, a responsive layout, and illustrations that carry from scene to scene. Behind the scenes, ',
  text: 'the real work was the AI-driven image pipeline, and keeping the characters and the art direction consistent across every page of the story',
  after: '.',
}

const SPOT_THE_DIFFERENCE_INTRO =
  'A browser spot-the-difference game built around illustrated puzzle collections. Each puzzle hides ten differences between two nearly identical images.'

const SPOT_THE_DIFFERENCE_BULLETS = [
  {
    label: 'Multiple Collections:',
    text: ' Dozens of AI-generated puzzle images organized into themed, unlockable collections, with more added over time.',
  },
  {
    label: 'Touch-Friendly Precision:',
    text: ' Pinch to zoom, drag to pan, and double-tap to reset, so spotting a small difference works as well on a phone as on a desktop.',
  },
  {
    label: 'Persistent Progress:',
    text: " Stars found per collection are saved in the browser's own storage, so progress carries over between visits.",
  },
  {
    label: 'Anti-Spam Safeguard:',
    text: " A short cooldown after every tap, and a longer one after a wrong guess, so players can't rapid-fire their way through a puzzle.",
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const SPOT_THE_DIFFERENCE_HIGHLIGHT = {
  before:
    'This is a browser spot-the-difference game built around dozens of AI-generated puzzle images, organized into unlockable collections. Each puzzle shows two nearly identical illustrations side by side. The player taps to flag each of ten hidden differences, a star lights up per find, and progress saves automatically between sessions. Pinch-to-zoom and drag-to-pan make it as playable on a phone as on a desktop. To keep it fair, ',
  text: 'a short cooldown after every tap, and a longer one after a wrong guess, stops players from rapid-fire guessing their way through a puzzle',
  after: ', so finding a difference requires looking for it.',
}

const UPPERCASE_INTRO =
  'An original word game on a letter grid, designed and built from scratch to run in the browser.'

const UPPERCASE_BULLETS = [
  {
    label: 'Full-Lifecycle Development:',
    text: ' I took it from the first idea to a deployed game, on my own.',
  },
  {
    label: 'Game State:',
    text: ' The logic tracks every input, the progression of the round, and the win and loss conditions as you play.',
  },
  {
    label: 'Responsive UI:',
    text: ' A clean interface that shows the player what to do without instructions, and fits phone, tablet, and desktop.',
  },
  {
    label: 'Nothing to Install:',
    text: ' It loads and plays in the browser. No download, no app store.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page and on Applications.
const UPPERCASE_HIGHLIGHT = {
  before:
    'This is an original browser game, built from scratch. A game is a different problem from a website. It has to react to every tap the instant it happens, keep score, and hold its state through a whole round without a stumble. ',
  text: 'I applied the same approach I use in pipeline development: structure the data first, and anticipate the technical hurdles before they show up',
  after:
    '. The interface is built to feel the same on a desktop and a tablet. Taking it from the initial concept to a deployed game is the part I wanted to show.',
}

const CODE_BREAKER_INTRO =
  'A digital version of a classic code-breaking game. The rules already existed, and the job was to get them exactly right in software.'

const CODE_BREAKER_BULLETS = [
  {
    label: 'Precise Rule Execution:',
    text: ' The fixed mechanics of a known game, carried into a custom build. It worked like building to a product spec.',
  },
  {
    label: 'Feedback Logic:',
    text: ' Every guess is scored against the hidden sequence on the spot, and the win and loss conditions are worked out as you go.',
  },
  {
    label: 'State Management:',
    text: ' Every attempt is tracked and stored, and the interface updates without lag or a page reload.',
  },
  {
    label: 'Responsive UI Design:',
    text: ' A clean layout that keeps the focus on the puzzle, at any screen size.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page and on Applications.
const CODE_BREAKER_HIGHLIGHT = {
  before:
    'This is a digital adaptation of a classic code-breaking puzzle game. The concept is familiar, and the technical work was in translating its strict, pre-defined rules into a browser game. That meant precise logic to evaluate each guess against a hidden sequence, return accurate feedback right away, and keep the state of the game across every attempt. In the end, recreating this game was an exercise in ',
  text: 'taking a strict set of predefined rules and translating them',
  after: ' into a reliable, straightforward interface.',
}

const VIDEO_JIGSAW_INTRO =
  'A jigsaw puzzle where the pieces are cut from a video that never stops playing. Built for the iPad.'

const VIDEO_JIGSAW_BULLETS = [
  {
    label: 'Multimedia Integration:',
    text: ' Browser canvas tools slice a live video feed into interlocking, draggable puzzle pieces.',
  },
  {
    label: 'Performance:',
    text: ' The drawing logic redraws the video frames continuously, and playback has to stay smooth without lagging or crashing the browser.',
  },
  {
    label: 'Dynamic Interaction:',
    text: ' The interface handles drag-and-drop while keeping track of the state and position of pieces that are themselves moving pictures.',
  },
  {
    label: 'Playable UX:',
    text: ' What starts as a programming exercise ends up as a media-rich puzzle that runs entirely on the client.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const VIDEO_JIGSAW_HIGHLIGHT = {
  before:
    'This is a jigsaw puzzle with a twist. Instead of a static image, the pieces are sliced from a video that keeps playing. That is a specific technical problem: take the video stream, cut it into interlocking shapes, and keep updating every piece so the video plays smoothly even while you drag them around the screen. In the end, ',
  text: 'building this was an exercise in performance optimization',
  after: ', keeping the heavy media work out of sight so the puzzle stays fast and fun to play.',
}

const MINI_GAMES_INTRO =
  'A growing collection of browser puzzle games built for iPad first and desktop second, from Sudoku and Kakuro to several fully modeled 3D scenes.'

const MINI_GAMES_BULLETS = [
  {
    label: 'Provably Fair Puzzles:',
    text: ' Every board is generated fresh from a seeded random number generator, and a solver checks each logic puzzle for exactly one solution before a player ever sees it.',
  },
  {
    label: '3D Scenes Built From Scratch:',
    text: ' Several games render in WebGL, with orbiting cameras and baked lighting. There are no textures anywhere. Every surface detail is real geometry.',
  },
  {
    label: 'Taught, Not Just Explained:',
    text: ' Every game ships with a Rule Book, and several also play themselves through a scripted tutorial that narrates each move on the live board.',
  },
  {
    label: 'No Framework, No Backend:',
    text: ' Plain ES modules with zero runtime dependencies. It installs to the iPad home screen and plays fully offline.',
  },
]

// Split around the phrase called out in pink, same pattern as the other
// highlighted phrases on this page.
const MINI_GAMES_HIGHLIGHT = {
  before:
    'This is a growing collection of browser puzzle games, from familiar logic puzzles like Sudoku and Kakuro to several fully modeled 3D scenes rendered in WebGL, with orbiting cameras and baked lighting. I built it for iPad first. ',
  text: 'Every board is generated fresh from a seeded random number generator, and a solver checks each logic puzzle for exactly one solution before a player sees it',
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
