import comfortCaninesPoster from '../assets/projects/ferris-video/ads-videos/comfort-canines-poster.webp'
import retrieverScreenshot from '../assets/projects/retriever/homepage/ret-library.webp'
import creativeOpsScreenshot from '../assets/projects/creativeops-portal/homepage/co-tab1.webp'
import miniGamesScreenshot from '../assets/projects/mini-games/homepage/mg-harbor2.webp'

// Home-page content that is not one of the /work/:slug categories in
// projects.js. It lives in its own module rather than in pages/Home.jsx
// because the About dialog reads the same two arrays to count entries and
// list the categories, and a page that also exports data breaks fast
// refresh.

// Standalone home-page features, each with its own live site.
// Each film streams directly from that site rather than being
// bundled into this repo — embedding actual video files would bloat the
// standalone single-file build considerably for no benefit, since it's the
// same file either way. `filmUrl`/`filmPoster`/`filmDuration` are optional —
// omit them (as every entry below does — none has a video) and the
// "Watch the Film" button just doesn't render. Order is carousel order —
// Retriever is first (leftmost) per request.
// Exported so the About dialog can count them rather than quoting a number
// that goes stale the next time this list changes.
export const FEATURED_PROJECTS = [
  {
    id: 'retriever',
    url: 'https://dak-retriever.netlify.app/',
    image: retrieverScreenshot,
    imageAlt:
      'Retriever asset library showing a faceted search grid of clay-render 3D asset thumbnails with category filters',
    tag: 'Digital Asset Management',
    title: 'Retriever',
    tagline: '"Every curated asset in the studio, render-ready with its dependencies collected."',
    text: "A digital asset management system that gives an architectural visualization studio one shared library for every 3D asset it owns, instead of files scattered across old projects and hard drives. Artists stop rebuilding things that already exist and start reusing the studio's best work instead.",
    note: 'Fictional demonstration built for portfolio purposes, drawing on experience running asset libraries in architectural visualization. Studio Ferris and everything in its library, including every client, person, and asset, is invented. The name comes from my dog, Ferris, who is half Labrador and half German Shepherd: half retriever, half guardian of the flock. Same job description as this app.',
  },
  {
    id: 'creativeops',
    url: 'https://dak-creativeops.netlify.app/',
    image: creativeOpsScreenshot,
    imageAlt:
      'CreativeOps Command Portal dashboard showing the Creative Request Intake form and a live AI Pre-Flight Audit with brief health score',
    tag: 'Creative Operations Dashboard',
    title: 'CreativeOps Command Portal',
    tagline: '"Nothing enters the queue without passing pre-flight."',
    text: 'A concept prototype of a creative operations dashboard for a fictional brand studio: intake with a rules-based pre-flight check, designer workload in plain hours, an asset registry, and a four-language localization pipeline. It is fully interactive, with two guided tours, and follows one request through its whole lifecycle with every number computed live.',
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
    tagline: '"Every board is built fresh. You never see the same one twice."',
    text: 'A growing collection of browser puzzle games built for iPad first and desktop second: Sudoku, word and number puzzles, memory games, and several fully modeled 3D scenes rendered in WebGL. Boards are generated fresh every time, and the logic puzzles are checked for a single solution before a player ever sees them.',
    note: 'Personal project, still growing: over a dozen games are playable today, with more logic puzzles in progress.',
  },
]

// The 4 home category tiles are broader groupings than the underlying project
// slugs — each links through to one representative project page. `web-games`
// has no real project yet, so it's a placeholder (see src/data/projects.js).
// Exported for the About dialog, which lists these titles rather than
// repeating them by hand.
export const HOME_CATEGORIES = [
  { slug: 'web-applications', title: 'Applications' },
  { slug: 'architecture', title: 'Architectural Visualization' },
  { slug: 'ferris-video', title: 'AI Assisted Visuals', cover: comfortCaninesPoster },
  { slug: 'web-games', title: 'Web Games' },
  { slug: '3d-printing', title: '3D Printing' },
]
