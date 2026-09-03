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
  'A proposed Amazon A+ Content page for a gravity-fed water filter, built from the five standard Amazon product-detail modules.'

const WATER_FILTRATION_BULLETS = [
  {
    label: 'Amazon-Native Modules:',
    text: " Assembled from Amazon's fixed Seller Central templates: image header, sidebar, three-image feature grid, comparison chart, and text overlay. No free-form HTML.",
  },
  {
    label: 'Product Storytelling:',
    text: " Walks a shopper through the filter's ceramic and carbon stages, tool-free assembly, and environmental impact.",
  },
]

const REALTOR_INTRO =
  'A location lookup tool that pulls real data from nearly a dozen public and government sources and puts a property and its neighborhood on one screen.'

const REALTOR_BULLETS = [
  {
    label: 'Instant Property Profiles:',
    text: ' Search any Pennsylvania address and get ownership, zoning, tax assessments, utility providers, and broadband availability.',
  },
  {
    label: 'Integrated Visuals:',
    text: ' The data sits next to interactive parcel boundaries, 3D satellite imagery, and street-level photos.',
  },
  {
    label: 'Demographic Tools:',
    text: ' A separate module pulls Census data, including population and income, for any state, county, or neighborhood.',
  },
  {
    label: 'The Technical Challenge:',
    text: ' The real work was data normalization. Nine county systems each format their records differently, and the app has to make them read as one.',
  },
]

// Split around the phrase called out in pink — the page's one deliberate
// accent use, everything else is white/cyan — so it renders as a
// highlighted <span>.
const REALTOR_HIGHLIGHT = {
  before:
    'I built this as a location intelligence tool that pulls real data from nearly a dozen public and government sources. You can search any city for live weather, or enter a Pennsylvania address and get ownership, zoning, tax assessments, utility providers, and broadband access, alongside interactive parcel maps, 3D satellite imagery, and street-level photos. A built-in demographic tool pulls Census data, such as population and income, for any state, county, or neighborhood. Behind the scenes, ',
  text: 'the hard part was standardizing fragmented information from multiple incompatible databases',
  after: ', nine distinct county systems among them, into a single interface that reads as one.',
}

const PROJECT_MANAGEMENT_NOTE =
  'NOTE: This app is designed to operate on a local network with local cache. This is for demonstration only, and most operational functionality will not work. It has been populated with simulated data.'

const PROJECT_MANAGEMENT_INTRO =
  'A self-contained project management dashboard that keeps a construction project in one place, from the initial charter to final closeout.'

const PROJECT_MANAGEMENT_BULLETS = [
  {
    label: 'Centralized Workflow:',
    text: ' Scheduling, budget tracking, document storage for photos and drawings, team contacts, and a final walkthrough checklist, all in one interface.',
  },
  {
    label: 'At-a-Glance Reporting:',
    text: ' A top-level summary of project health, including budget used and tasks completed.',
  },
  {
    label: 'Lightweight Architecture:',
    text: ' Runs entirely in the browser. No external servers, no SaaS dependencies.',
  },
  {
    label: 'Persistent Data:',
    text: " Saves and reloads all project data with the browser's built-in storage, so nothing is lost between sessions.",
  },
]

// Same pattern as REALTOR_HIGHLIGHT — split around the one phrase called out
// in pink.
const PROJECT_MANAGEMENT_HIGHLIGHT = {
  before:
    'This dashboard manages a construction project through its whole lifecycle. Scheduling, budget tracking, team directories, document management for photos and drawings, and a closeout punch list all live on one screen. To keep it light, ',
  text: 'I built it to run entirely within the web browser, with no external servers and no software subscriptions',
  after: ". It saves and retrieves everything through the browser's own storage, so progress is never lost.",
}

const PROJECT_COORDINATION_NOTE =
  'NOTE: This front-end app is designed to operate with local cache. This is for demonstration only. There is no database, no login, and no email actually sent. Refreshing the page resets every module back to its starting data. Client names, product lines, batch numbers, meeting notes, and message copy are all realistic placeholder content.'

const PROJECT_COORDINATION_INTRO =
  'A project coordination dashboard I built around the daily work of a Project Coordinator: account management, production scheduling, and administrative support.'

const PROJECT_COORDINATION_BULLETS = [
  {
    label: 'Centralized Operations:',
    text: ' Task tracking, timeline management, and stakeholder organization in one easy-to-read interface.',
  },
  {
    label: 'Workflow Optimization:',
    text: ' Applies what I learned in pipeline development to turn overlapping project data into clear, actionable steps.',
  },
  {
    label: 'Practical Utility:',
    text: ' Built for the real operational problems of managing cross-functional projects.',
  },
  {
    label: 'Intuitive UI/UX:',
    text: " A clean layout that lets a coordinator read project health and set the day's priorities without friction.",
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const PROJECT_COORDINATION_HIGHLIGHT = {
  before:
    'I built this dashboard to simulate and streamline the daily tasks of a solo project coordinator. It is a central hub for managing timelines, tracking tasks, and organizing stakeholder communication. Using my experience in pipeline development, I designed the interface to take ',
  text: 'complex, overlapping project data and turn it into a clear, actionable workflow',
  after:
    '. Building it was a practical exercise in applying technical problem-solving to real administrative work, and the result is a straightforward interface that keeps projects organized and moving.',
}

const MOBILE_LENS_INTRO =
  'An interactive lesson on the three decisions behind every smartphone photograph: composition, lighting, and depth of field.'

const MOBILE_LENS_BULLETS = [
  {
    label: 'Composition:',
    text: ' Overlays live Rule of Thirds and Golden Spiral grids on a real photograph, so you see the guides against an actual frame.',
  },
  {
    label: 'Lighting:',
    text: ' Drag a divider between two exposures of the same scene to compare midday sun with golden hour.',
  },
  {
    label: 'Depth of Field:',
    text: ' Tap any subject to lock focus and blur the background. Shallow depth of field, shown in real time.',
  },
  {
    label: 'Accessible by Design:',
    text: ' No framework and no runtime dependencies, with full keyboard support, and every animation gated behind prefers-reduced-motion.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const MOBILE_LENS_HIGHLIGHT = {
  before:
    'This is a hands-on lesson that breaks smartphone photography into three exercises: composition, lighting, and depth of field. Rather than describe each concept, every module lets you work the photograph directly. You toggle the grid overlays, drag between two exposures, or tap to rack focus, and the effect is felt right away instead of read about. Built with ',
  text: 'no framework and no runtime dependencies',
  after:
    ', the whole lesson runs from a single page, with full keyboard support and reduced-motion handling from the start.',
}

const PIPELINE_AUTOMATION_NOTE =
  'NOTE: This is a demonstration dashboard populated with hardcoded mock data. There is no live backend or automation engine behind it. The Simulate Intake, Run Compliance Scan, and Print / Export PDF actions are intentionally inert in this build.'

const PIPELINE_AUTOMATION_INTRO =
  'A pipeline automation dashboard that tracks commercial mechanical and HVAC construction projects from intake through live execution.'

const PIPELINE_AUTOMATION_BULLETS = [
  {
    label: 'Stage-Gated Pipeline:',
    text: ' Every project is a card on a Kanban board, moving through Intake, Engineering Review, Subcontractor Assignment, and Live Execution.',
  },
  {
    label: 'Schedule & Compliance Tracking:',
    text: ' A Gantt-style milestone timeline sits beside a subcontractor compliance grid covering insurance, purchase orders, and change orders.',
  },
  {
    label: 'Financial Oversight:',
    text: ' Budgeted-vs-actual hours and purchase order drawdown, charted so cost risk shows up at a glance.',
  },
  {
    label: 'Guided Onboarding:',
    text: ' A built-in tour walks a new user through every module.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const PIPELINE_AUTOMATION_HIGHLIGHT = {
  before:
    'I built this dashboard to manage commercial mechanical and HVAC construction projects from first contact through completion. Active work sits on a stage-gated Kanban board (Intake, Engineering Review, Subcontractor Assignment, and Live Execution) next to a Gantt-style schedule, a vendor compliance grid, and budget-vs-actual tracking. In the end, ',
  text: 'modeling a multi-stage approval pipeline as a single board',
  after:
    ' let the whole team see where a project stood and what was blocking it, without digging through separate spreadsheets for scheduling, compliance, and budget.',
}

const RESIDENTIAL_ARCHITECTURE_BROCHURE_NOTE =
  'NOTE: This is a demonstration brochure page populated with placeholder pricing, community, and description text. The floor plan renders and the interactive configurator are real; the surrounding marketing copy is not tied to any actual property.'

const RESIDENTIAL_ARCHITECTURE_BROCHURE_INTRO =
  'A residential architecture brochure and floor plan configurator that pairs the pricing and feature copy a builder would publish with an interactive, zoomable floor plan.'

const RESIDENTIAL_ARCHITECTURE_BROCHURE_BULLETS = [
  {
    label: 'Elevation Configurator:',
    text: ' Buyers compare four exterior elevation styles, each with its own price difference, and switch any of them between a photorealistic render and a technical line drawing.',
  },
  {
    label: 'Interactive Floor Plan Viewer:',
    text: ' Pan, zoom, and switch between the first and second story, with an overlay toggle and one-click re-centering.',
  },
  {
    label: 'Marketing-Ready Layout:',
    text: ' Pricing, square footage, and feature highlights in a brochure format built to match a production home builder website.',
  },
  {
    label: 'Virtual Tour Integration:',
    text: ' A virtual tour entry point sits right on the primary elevation render.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const RESIDENTIAL_ARCHITECTURE_BROCHURE_HIGHLIGHT = {
  before:
    'This is a residential architecture brochure and floor plan configurator built to look like a production home builder website. It presents one floor plan, with photorealistic exterior renders, pricing, square footage, and feature highlights, alongside four selectable elevation styles that each switch between a render and a line drawing. Underneath the marketing layer, ',
  text: 'the floor plan itself is a fully interactive viewer with pan, zoom, and floor switching between the first and second story',
  after: '. A static brochure image becomes something a buyer can actually explore.',
}

const CALETA_NOTE =
  'NOTE: This is a fictional development created for portfolio demonstration only. The architecture, renders, brand identity, and marketing site are AI-assisted concept work, not built for or affiliated with any real property.'

const CALETA_INTRO =
  'A ten-story, fifty-residence luxury condominium concept on a 216-acre private island. I designed and built the whole thing, from the architecture through the marketing site.'

const CALETA_BULLETS = [
  {
    label: 'Full-Concept Architecture:',
    text: ' I designed the building massing, the unit layouts, and the site plan for a fifty-residence, ten-story tower on a 216-acre private island.',
  },
  {
    label: 'AI-Assisted Visualization:',
    text: ' Photorealistic exterior and interior renders across every finish level, amenity space, and time of day.',
  },
  {
    label: 'Brand Identity:',
    text: ' The full brand system, logo, type, color, and voice, built around the "Low-rise living. Boundless island." positioning.',
  },
  {
    label: 'Marketing Site & Film:',
    text: ' I designed and built the complete marketing website plus a 1:22 brand film, both sharing the same visual system as the renders.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const CALETA_HIGHLIGHT = {
  before:
    'This is the marketing site for a fictional luxury condominium development: a ten-story, fifty-residence tower on a 216-acre private island. Every piece, from the architecture and interior finishes to the brand identity and the site itself, was designed and produced as one connected system. ',
  text: 'Carrying one architectural vision through renders, brand, film, and the live site',
  after: ' is the full pipeline from concept to a finished, presentable property, and that is what I wanted to show here.',
}

const BUILDHR_NOTE =
  'NOTE: This is a fictional marketing campaign created for portfolio demonstration only. The company, product, and case study are AI-assisted concept work, not produced for or affiliated with any real business.'

const BUILDHR_INTRO =
  'A concept integrated marketing campaign for a fictional construction-software company, built as one scrollable case study across six channels, from concept through delivery.'

const BUILDHR_BULLETS = [
  {
    label: 'Content Marketing:',
    text: ' An eBook spread using art-directed, AI-generated lifestyle imagery finished in Photoshop, plus data visualizations on a shared grid.',
  },
  {
    label: 'Digital & Video:',
    text: ' A three-card LinkedIn ad carousel and a :20 brand film, both built from the same generated image and video library.',
  },
  {
    label: 'Web & Brand Stewardship:',
    text: ' The same visual system carried into a homepage hero and one type scale across every channel.',
  },
  {
    label: 'Tradeshow & Print:',
    text: ' The digital-first campaign adapted for large-format booth graphics and CMYK print handoff.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const BUILDHR_HIGHLIGHT = {
  before:
    'This is a concept marketing campaign for a fictional construction-software company, presented as a single scrollable case study across six channels: content marketing, digital advertising, video, web and brand, tradeshow and print, and the project workflow underneath it all. There is no stock photography. Every image was ',
  text: 'art-directed and AI-generated from a written brief, screened for the artifacts generative images tend to produce, and finished in Photoshop',
  after:
    ', so one visual system carries across an eBook, a LinkedIn carousel, a :20 film, a web hero, and a tradeshow booth.',
}

const RETRIEVER_NOTE =
  'NOTE: This is a fictional demonstration built for portfolio purposes, drawing on experience running asset libraries in architectural visualization. Studio Ferris and everything in its library, including every client, person, and asset, is invented.'

const RETRIEVER_INTRO =
  'A working digital asset management system for Studio Ferris, a fictional 22-artist architectural visualization studio. It covers the full loop, from intake to reuse.'

const RETRIEVER_BULLETS = [
  {
    label: 'Faceted Library Search:',
    text: ' Every asset, whether a model, material, HDRI, scene, CAD file, or render, is searchable by category. The detail view shows its dependency manifest, version history, license, and every project it has been used on.',
  },
  {
    label: 'Validated Intake:',
    text: ' A live file-naming validator and a dependency check run on every incoming asset before it is registered. Naming and reference errors get caught before they reach the shared library.',
  },
  {
    label: 'License & NDA Governance:',
    text: ' Marketplace licenses are tracked, NDA-restricted client assets are flagged, and any attempt to reuse one outside its original project is logged.',
  },
  {
    label: 'ROI Dashboard:',
    text: ' Counts the modeling hours saved through reuse and shows how heavily each project draws on the shared library.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const RETRIEVER_HIGHLIGHT = {
  before:
    'I built Retriever as a working digital asset management system for Studio Ferris, a fictional 22-artist architectural visualization studio. It follows an asset through its whole life in the library. Intake checks file naming and dependencies before anything is registered, faceted search makes every asset findable by category, and the detail view shows its dependency manifest, license, and usage history. Underneath it all, ',
  text: 'an ROI dashboard turns every reused asset into a number of modeling hours saved',
  after: ', which is the case for a shared library in terms a studio actually tracks.',
}

const CREATIVE_OPS_NOTE =
  'NOTE: This is a fictional concept prototype built as a portfolio piece for a Creative Operations Manager application. DAK Labs and everything in it, including every person, campaign, vendor, and metric, is invented. There is no backend and nothing here is connected to a real system.'

const CREATIVE_OPS_INTRO =
  'A concept prototype of a creative operations dashboard for a fictional brand studio. It covers the full path a marketing request travels: intake, a rules-based pre-flight check, designer assignment, and a four-language localization pipeline.'

const CREATIVE_OPS_BULLETS = [
  {
    label: 'Rules-Based Pre-Flight:',
    text: ' Every incoming brief is checked against a fixed list of written rules and gets a health score out of 100. A missing approver or an unspecified aspect ratio is caught before a designer ever sees the request.',
  },
  {
    label: 'Designer Bandwidth in Plain Hours:',
    text: ' Each designer is tracked against roughly 80 bookable hours per sprint, so capacity is hours booked over hours available, not a guess at how busy someone looks.',
  },
  {
    label: 'Connected Across Four Tabs:',
    text: ' Approving a request creates a task, a registry row, and a translation lane at the same moment, and the header metrics recalculate as work moves.',
  },
  {
    label: 'Guided From the First Click:',
    text: ' A 30-second Quick Tour, a 2-minute Full Tour, and a user manual that explains every rule and how each number is calculated.',
  },
]

// Split around the phrase called out in pink — same pattern as the other
// highlighted phrases on this page.
const CREATIVE_OPS_HIGHLIGHT = {
  before:
    'This is a concept prototype of a creative operations dashboard for a fictional brand studio, DAK Labs. It follows one marketing request across its whole lifecycle: an intake form checked by a rules-based pre-flight audit, a designer resourcing board that tracks workload in plain hours, a campaign asset registry with an approval clock, and a four-language localization pipeline. Underneath the interface, ',
  text: 'every number on screen, from the pre-flight score to the team bandwidth reading in the header, is computed from what happens on the page rather than typed in',
  after: ', so the four screens behave like one system instead of four separate reports.',
}

// Keyed by section heading (rather than array index) so reordering
// `sections` in projects.js can't silently mismatch a section with the
// wrong write-up — same pattern as WebGamesShowcase's SECTION_DESCRIPTIONS.
const SECTION_DESCRIPTIONS = {
  'Retriever — Digital Asset Management': {
    note: RETRIEVER_NOTE,
    noteColor: 'red',
    notePosition: 'bottom',
    intro: RETRIEVER_INTRO,
    bullets: RETRIEVER_BULLETS,
    highlight: RETRIEVER_HIGHLIGHT,
  },
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
