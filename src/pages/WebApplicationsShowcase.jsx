import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValue } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import HudBackground from '../components/HudBackground'
import MediaGallery from '../components/MediaGallery'
import AppDescription from '../components/AppDescription'
import styles from './WebApplicationsShowcase.module.css'

const slugify = (heading) => heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Unlike Architecture/AI Visuals, this page doesn't use the HudShowcase
// viewer+thumbnail-rail+category-tabs — with only one screenshot per app,
// that mechanism was overkill (dead nav arrows, a rail with a single
// thumbnail). Instead this reuses the same HUD chrome (background, back
// link, eyebrow, fonts/colors) around a plain MediaGallery grid per section,
// same as the original pre-redesign layout.
// Opening sentence, then one bullet per labeled callout (bold label rendered
// via <strong>), then a final labeled "Description" paragraph set apart by
// extra space below the bullet list.
const WATER_FILTRATION_INTRO =
  'A proposed Amazon A+ Content page for a gravity-fed water filtration system, built from the five standard Amazon product-detail module templates.'

const WATER_FILTRATION_BULLETS = [
  {
    label: 'Amazon-Native Modules:',
    text: " Assembled entirely from Amazon's fixed Seller Central templates—image header, sidebar, three-image feature grid, comparison chart, and text overlay—rather than free-form HTML.",
  },
  {
    label: 'Product Storytelling:',
    text: " Walks a shopper through the filter's ceramic and carbon filtration stages, tool-free assembly, and environmental impact.",
  },
]

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

const MOBILE_LENS_INTRO =
  'An interactive instructional module that teaches the three core decisions behind every smartphone photograph: composition, lighting, and depth of field.'

const MOBILE_LENS_BULLETS = [
  {
    label: 'Composition:',
    text: ' Overlays live Rule of Thirds and Golden Spiral grids directly on the frame so users can see compositional guides against a real photograph.',
  },
  {
    label: 'Lighting:',
    text: ' Lets users drag a divider between two exposures of the same scene to compare midday sun against golden hour light.',
  },
  {
    label: 'Depth of Field:',
    text: ' Allows users to tap any subject to lock focus and blur the background, demonstrating shallow depth of field in real time.',
  },
  {
    label: 'Accessible by Design:',
    text: ' Built with no framework or runtime dependencies, with full keyboard support and all animation gated behind prefers-reduced-motion.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const MOBILE_LENS_HIGHLIGHT = {
  before:
    'This application is a hands-on instructional tool that breaks smartphone photography down into three interactive exercises: composition, lighting, and depth of field. Rather than simply describing these concepts, each module lets the user manipulate the photograph directly—toggling grid overlays, dragging between two exposures, or tapping to rack focus—so the effect is felt immediately rather than just read about. Built with ',
  text: 'no framework and no runtime dependencies',
  after:
    ', the entire lesson runs from a single page, with full keyboard support and reduced-motion handling built in from the start.',
}

const PIPELINE_AUTOMATION_NOTE =
  'NOTE: This is a demonstration dashboard populated with hardcoded mock data. There is no live backend or automation engine behind it. The Simulate Intake, Run Compliance Scan, and Print / Export PDF actions are intentionally inert in this build.'

const PIPELINE_AUTOMATION_INTRO =
  'A custom-built pipeline automation dashboard designed to track commercial mechanical and HVAC construction projects from initial intake through live execution.'

const PIPELINE_AUTOMATION_BULLETS = [
  {
    label: 'Stage-Gated Pipeline:',
    text: ' Visualizes every project as a Kanban board moving through Intake, Engineering Review, Subcontractor Assignment, and Live Execution.',
  },
  {
    label: 'Schedule & Compliance Tracking:',
    text: ' Pairs a Gantt-style milestone timeline with a subcontractor compliance grid covering insurance, purchase orders, and change orders.',
  },
  {
    label: 'Financial Oversight:',
    text: ' Visualizes budgeted-vs-actual hours and purchase order drawdown to surface cost risk at a glance.',
  },
  {
    label: 'Guided Onboarding:',
    text: ' Includes a built-in guided tour that walks a new user through every module.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const PIPELINE_AUTOMATION_HIGHLIGHT = {
  before:
    'This application is a pipeline automation dashboard built to manage commercial mechanical and HVAC construction projects from first contact through completion. It organizes active work into a stage-gated Kanban board—Intake, Engineering Review, Subcontractor Assignment, and Live Execution—alongside a Gantt-style schedule, a vendor compliance grid, and budget-vs-actual financial tracking. Ultimately, ',
  text: 'modeling a multi-stage approval pipeline as a single, at-a-glance board',
  after:
    ' let the whole team see exactly where a project stood and what was blocking it, without digging through separate spreadsheets for scheduling, compliance, and budget.',
}

const RESIDENTIAL_ARCHITECTURE_BROCHURE_NOTE =
  'NOTE: This is a demonstration brochure page populated with placeholder pricing, community, and description text. The floor plan renders and the interactive configurator are real; the surrounding marketing copy is not tied to any actual property.'

const RESIDENTIAL_ARCHITECTURE_BROCHURE_INTRO =
  'A custom-built residential architecture brochure and floor plan configurator, pairing marketing-ready pricing and feature copy with an interactive, zoomable floor plan viewer.'

const RESIDENTIAL_ARCHITECTURE_BROCHURE_BULLETS = [
  {
    label: 'Elevation Configurator:',
    text: ' Lets buyers compare four distinct exterior elevation styles, each swappable between a photorealistic render and a technical line drawing, with its own price delta.',
  },
  {
    label: 'Interactive Floor Plan Viewer:',
    text: ' Supports pan, zoom, and floor switching between the 1st and 2nd story, with an overlay toggle and one-click re-centering.',
  },
  {
    label: 'Marketing-Ready Layout:',
    text: ' Pairs pricing, square footage, and feature highlights in a brochure format built to match a production home builder website.',
  },
  {
    label: 'Virtual Tour Integration:',
    text: ' Surfaces a virtual tour entry point directly from the primary elevation render.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const RESIDENTIAL_ARCHITECTURE_BROCHURE_HIGHLIGHT = {
  before:
    'This application is a residential architecture brochure and floor plan configurator built to match the look of a production home builder website. It presents a single floor plan—photorealistic exterior renders, pricing, square footage, and feature highlights—alongside four selectable elevation styles, each swappable between a photorealistic render and a technical line drawing. Underneath the marketing layer, ',
  text: 'the floor plan itself is a fully interactive viewer supporting pan, zoom, and floor switching between the 1st and 2nd story',
  after: ', turning a static brochure image into something a buyer can actually explore.',
}

const CALETA_NOTE =
  'NOTE: This is a fictional development created for portfolio demonstration only. The architecture, renders, brand identity, and marketing site are AI-assisted concept work, not built for or affiliated with any real property.'

const CALETA_INTRO =
  'A ten-story, fifty-residence ultra-luxury condominium concept set on a 216-acre private island, designed and built end-to-end from architecture through the full marketing site.'

const CALETA_BULLETS = [
  {
    label: 'Full-Concept Architecture:',
    text: ' Designed the building massing, unit layouts, and site plan for a fifty-residence, ten-story tower set on a 216-acre private island.',
  },
  {
    label: 'AI-Assisted Visualization:',
    text: ' Produced photorealistic exterior and interior renders across every finish level, amenity space, and time of day.',
  },
  {
    label: 'Brand Identity:',
    text: ' Developed the full brand system—logo, type, color, and voice—built around the "Low-rise living. Boundless island." positioning.',
  },
  {
    label: 'Marketing Site & Film:',
    text: ' Designed and built the complete marketing website plus a 1:22 brand film, both sharing the same visual system as the renders.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const CALETA_HIGHLIGHT = {
  before:
    'This application is the marketing site for a fictional ultra-luxury condominium development—a ten-story, fifty-residence tower set on a 216-acre private island. Every piece, from the architecture and interior finishes to the brand identity and the site itself, was designed and produced end-to-end as a single connected system. Ultimately, ',
  text: 'carrying one architectural vision through renders, brand, film, and the live site itself',
  after: ' demonstrates the full pipeline from concept to a finished, presentable marketing property.',
}

const BUILDHR_NOTE =
  'NOTE: This is a fictional marketing campaign created for portfolio demonstration only. The company, product, and case study are AI-assisted concept work, not produced for or affiliated with any real business.'

const BUILDHR_INTRO =
  'A conceptual integrated marketing campaign for a fictional construction-software company, built as a single scrollable case study covering six channels from concept through delivery.'

const BUILDHR_BULLETS = [
  {
    label: 'Content Marketing:',
    text: ' Designed an eBook spread using art-directed, AI-generated lifestyle imagery finished in Photoshop, plus data visualizations built on a shared grid.',
  },
  {
    label: 'Digital & Video:',
    text: ' Produced a three-card LinkedIn ad carousel and a :20 brand film, both built around the same generated image and video library.',
  },
  {
    label: 'Web & Brand Stewardship:',
    text: ' Extended the same visual system into a homepage hero and a consistent type scale across every channel.',
  },
  {
    label: 'Tradeshow & Print:',
    text: ' Adapted the digital-first campaign for large-format booth graphics and CMYK print handoff.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const BUILDHR_HIGHLIGHT = {
  before:
    'This application is a conceptual marketing campaign for a fictional construction-software company, presented as a single scrollable case study across six channels—content marketing, digital advertising, video production, web and brand, tradeshow and print, and the underlying project workflow. Rather than relying on stock photography, every image was ',
  text: 'art-directed and AI-generated from a written brief, then screened for the artifacts generative images tend to produce, before finishing in Photoshop',
  after:
    ', carrying one consistent visual system across an eBook, a LinkedIn carousel, a :20 film, a web hero, and a tradeshow booth.',
}

const CREATIVE_OPS_NOTE =
  'NOTE: This is a fictional concept prototype built as a portfolio piece for a Creative Operations Manager application. DAK Labs and everything in it, including every person, campaign, vendor, and metric, is invented. There is no backend and nothing here is connected to a real system.'

const CREATIVE_OPS_INTRO =
  'A concept prototype of a creative operations dashboard for a fictional brand studio, covering the full path a marketing request travels: intake, a rules based pre-flight check, designer assignment, and a four language localization pipeline.'

const CREATIVE_OPS_BULLETS = [
  {
    label: 'Rules Based Pre-Flight:',
    text: ' Checks every incoming brief against a fixed list of written rules and returns a health score out of 100, so a missing approver or an unspecified aspect ratio is caught before a designer ever sees the request.',
  },
  {
    label: 'Designer Bandwidth in Plain Hours:',
    text: ' Tracks each designer against roughly 80 bookable hours per sprint, so capacity is a simple ratio of hours booked to hours available rather than a subjective read of how busy someone looks.',
  },
  {
    label: 'Connected Across Four Tabs:',
    text: ' Approving a request creates a task, a registry row, and a translation lane at the same moment, and the header metrics recalculate live as work moves.',
  },
  {
    label: 'Guided From the First Click:',
    text: ' Ships a 30 second Quick Tour and a 2 minute Full Tour, plus a full user manual explaining every rule and how each number is calculated.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const CREATIVE_OPS_HIGHLIGHT = {
  before:
    'This application is a concept prototype of a creative operations dashboard for a fictional brand studio, DAK Labs. It follows one marketing request across its full lifecycle: an intake form checked by a rules based pre-flight audit, a designer resourcing board tracking workload in plain hours, a campaign asset registry with an approval clock, and a four language localization pipeline. Underneath the interface, ',
  text: "every number on screen, from the pre-flight score to the header's team bandwidth reading, is computed live from what happens on the page rather than typed in",
  after: ', so the four screens behave like one connected system instead of four separate reports.',
}

// Keyed by section heading (rather than array index) so reordering
// `sections` in projects.js can't silently mismatch a section with the
// wrong write-up — same pattern as WebGamesShowcase's SECTION_DESCRIPTIONS.
const SECTION_DESCRIPTIONS = {
  'Creative Ops': {
    note: CREATIVE_OPS_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: CREATIVE_OPS_INTRO,
    bullets: CREATIVE_OPS_BULLETS,
    highlight: CREATIVE_OPS_HIGHLIGHT,
  },
  'Water Filtration Infographic': {
    intro: WATER_FILTRATION_INTRO,
    bullets: WATER_FILTRATION_BULLETS,
  },
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
  'The Mobile Lens': {
    intro: MOBILE_LENS_INTRO,
    bullets: MOBILE_LENS_BULLETS,
    highlight: MOBILE_LENS_HIGHLIGHT,
  },
  'Pipeline Automation': {
    note: PIPELINE_AUTOMATION_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: PIPELINE_AUTOMATION_INTRO,
    bullets: PIPELINE_AUTOMATION_BULLETS,
    highlight: PIPELINE_AUTOMATION_HIGHLIGHT,
  },
  'Residential Architecture Brochure': {
    note: RESIDENTIAL_ARCHITECTURE_BROCHURE_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: RESIDENTIAL_ARCHITECTURE_BROCHURE_INTRO,
    bullets: RESIDENTIAL_ARCHITECTURE_BROCHURE_BULLETS,
    highlight: RESIDENTIAL_ARCHITECTURE_BROCHURE_HIGHLIGHT,
  },
  'Caleta — Private Island Residences': {
    note: CALETA_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: CALETA_INTRO,
    bullets: CALETA_BULLETS,
    highlight: CALETA_HIGHLIGHT,
  },
  'BuildHR — Integrated B2B Campaign': {
    note: BUILDHR_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: BUILDHR_INTRO,
    bullets: BUILDHR_BULLETS,
    highlight: BUILDHR_HIGHLIGHT,
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
  // HashRouter (routes like #/work/web-applications) as a route-change
  // attempt — the browser tries to navigate to a nonexistent page instead of
  // jumping to the section, which reads as the whole app going blank. Doing
  // the scroll in JS and never touching location.hash sidesteps that
  // entirely; href stays for keyboard/right-click/semantics.
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

          <span className={styles.eyebrow}>APPLICATIONS // PRODUCTIVITY ARCHIVE</span>

          <nav className={styles.toc} aria-label="Applications on this page">
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
          const link = section.media[0]?.href
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
                {link && (
                  <div className={styles.sectionCtaRow}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sectionCta}
                      data-cursor-hover
                    >
                      View Live Site ↗
                    </a>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
