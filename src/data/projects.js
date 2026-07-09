import { placeholderAt } from '../assets/placeholders'
import interiorsOrderRaw from '../../image-order-interiors.txt?raw'
import exteriorsOrderRaw from '../../image-order-exteriors.txt?raw'
import printsOrderRaw from '../../image-order-3d-printing.txt?raw'
import printsAssemblyVideo from '../assets/projects/3d-printing/prints/video-oct-07-4-24-41-pm.mp4'
import realtorDashboardScreenshot from '../assets/projects/realtor-dashboard/screenshots/dashboard-overview.webp'
import projectManagementScreenshot from '../assets/projects/project-management/screenshots/dashboard-overview.webp'
import projectCoordinationScreenshot from '../assets/projects/project-coordination/screenshots/project-coordination-screenshot.webp'
import interactiveStorybookScreenshot from '../assets/projects/web-games/interactive-storybook/storybook-cover-screenshot.webp'
import uppercaseGameScreenshot from '../assets/projects/web-games/uppercase-game/uppercase-game-screenshot.webp'
import codeBreakerScreenshot from '../assets/projects/web-games/codebreaker-game/codebreaker-game-screenshot.webp'
import videoJigsawScreenshot from '../assets/projects/web-games/video-jigsaw/jigsaw-gameplay.webp'

import dancingOrangutanVideo from '../assets/projects/ferris-video/videos/dancing-orangutan.mp4'
import dancingOrangutanPoster from '../assets/projects/ferris-video/videos/dancing-orangutan-poster.webp'
import extremeSportsVideo from '../assets/projects/ferris-video/videos/extreme-sports.mp4'
import extremeSportsPoster from '../assets/projects/ferris-video/videos/extreme-sports-poster.webp'
import greekGodsVideo from '../assets/projects/ferris-video/videos/greek-gods.mp4'
import greekGodsPoster from '../assets/projects/ferris-video/videos/greek-gods-poster.webp'
import ferrisParkVideo from '../assets/projects/ferris-video/videos/ferris-park.mp4'
import ferrisParkPoster from '../assets/projects/ferris-video/videos/ferris-park-poster.webp'
import royalFerrisResortVideo from '../assets/projects/ferris-video/videos/royal-ferris-resort.mp4'
import royalFerrisResortPoster from '../assets/projects/ferris-video/videos/royal-ferris-resort-poster.webp'

import brickCanvasVideo from '../assets/projects/ferris-video/conceptual-videos/brick-canvas.mp4'
import brickCanvasPoster from '../assets/projects/ferris-video/conceptual-videos/brick-canvas-poster.webp'
import connectionsVideo from '../assets/projects/ferris-video/conceptual-videos/connections.mp4'
import connectionsPoster from '../assets/projects/ferris-video/conceptual-videos/connections-poster.webp'
import greenSustainabilityVideo from '../assets/projects/ferris-video/conceptual-videos/green-sustainability.mp4'
import greenSustainabilityPoster from '../assets/projects/ferris-video/conceptual-videos/green-sustainability-poster.webp'

import charcuterieVideo from '../assets/projects/ferris-video/ads-videos/charcuterie.mp4'
import charcuteriePoster from '../assets/projects/ferris-video/ads-videos/charcuterie-poster.webp'
import comfortCaninesVideo from '../assets/projects/ferris-video/ads-videos/comfort-canines.mp4'
import comfortCaninesPoster from '../assets/projects/ferris-video/ads-videos/comfort-canines-poster.webp'
import ferrisBeerCommercialVideo from '../assets/projects/ferris-video/ads-videos/ferris-beer-commercial.mp4'
import ferrisBeerCommercialPoster from '../assets/projects/ferris-video/ads-videos/ferris-beer-commercial-poster.webp'
import ferrisIceCreamVideo from '../assets/projects/ferris-video/ads-videos/ferris-ice-cream.mp4'
import ferrisIceCreamPoster from '../assets/projects/ferris-video/ads-videos/ferris-ice-cream-poster.webp'
import milkVideo from '../assets/projects/ferris-video/ads-videos/milk.mp4'
import milkPoster from '../assets/projects/ferris-video/ads-videos/milk-poster.webp'

// AI Assisted Visuals — each folder is one thematic category (mirrors how
// architecture splits into interiors/exteriors), eagerly globbed so new
// files just need to be dropped in + imported via scripts/import-media.mjs.
const moviesTvModules = import.meta.glob('../assets/projects/ferris-video/movies-tv/*.webp', {
  eager: true,
  import: 'default',
})
const mythologyModules = import.meta.glob('../assets/projects/ferris-video/mythology-legend/*.webp', {
  eager: true,
  import: 'default',
})
const natureModules = import.meta.glob('../assets/projects/ferris-video/nature-creature-mashups/*.webp', {
  eager: true,
  import: 'default',
})
const everydayModules = import.meta.glob('../assets/projects/ferris-video/everyday-occupational/*.webp', {
  eager: true,
  import: 'default',
})
const retroModules = import.meta.glob('../assets/projects/ferris-video/retro-music/*.webp', {
  eager: true,
  import: 'default',
})
const classicArtModules = import.meta.glob('../assets/projects/ferris-video/classic-art-literature/*.webp', {
  eager: true,
  import: 'default',
})
const gamesModules = import.meta.glob('../assets/projects/ferris-video/games/*.webp', {
  eager: true,
  import: 'default',
})
const prehistoricModules = import.meta.glob('../assets/projects/ferris-video/prehistoric-dinosaurs/*.webp', {
  eager: true,
  import: 'default',
})
const sportsModules = import.meta.glob('../assets/projects/ferris-video/sports-action/*.webp', {
  eager: true,
  import: 'default',
})
const sciFiModules = import.meta.glob('../assets/projects/ferris-video/sci-fi-fantasy-worlds/*.webp', {
  eager: true,
  import: 'default',
})
const foodModules = import.meta.glob('../assets/projects/ferris-video/food-culture/*.webp', {
  eager: true,
  import: 'default',
})
const landmarksModules = import.meta.glob('../assets/projects/ferris-video/landmarks-icons/*.webp', {
  eager: true,
  import: 'default',
})

// Eagerly imports every webp in each folder, keyed by file path — so adding a
// new file via scripts/import-media.mjs is automatically picked up without
// needing a new `import` line here. Display order + captions are handled
// separately below.
const interiorsModules = import.meta.glob('../assets/projects/architecture/interiors/*.webp', {
  eager: true,
  import: 'default',
})
const exteriorsModules = import.meta.glob('../assets/projects/architecture/exteriors/*.webp', {
  eager: true,
  import: 'default',
})
const printsModules = import.meta.glob('../assets/projects/3d-printing/prints/*.webp', {
  eager: true,
  import: 'default',
})
const printsMiscModules = import.meta.glob('../assets/projects/3d-printing/misc/*.webp', {
  eager: true,
  import: 'default',
})

// "Spatial photo" parallax depth maps (see SpatialImage/HudShowcase) — one
// precomputed depth map per source image, named `<original-name>-depth.webp`
// in a sibling folder. buildOrderedMedia matches them up by filename below.
// Exteriors only — the spatial toggle isn't offered for Interiors.
const exteriorsDepthModules = import.meta.glob('../assets/projects/architecture/exteriors-depth/*.webp', {
  eager: true,
  import: 'default',
})

// Captions/alt text, keyed by filename. Reordering images is controlled by
// image-order-interiors.txt / image-order-exteriors.txt (project root) —
// this map only needs a new entry when a genuinely new image is added.
const interiorsCaptions = {
  'courtyard.webp': { caption: 'Courtyard', alt: 'Interior courtyard rendering' },
  'highriseinterior.webp': { caption: 'High-Rise Interior', alt: 'High-rise interior rendering' },
  'tropicalinterior.webp': { caption: 'Tropical Interior', alt: 'Tropical-themed interior rendering' },
}

const exteriorsCaptions = {
  'assistedliving-enhance-evening.webp': {
    caption: 'Assisted Living — Evening',
    alt: 'Assisted living facility, evening rendering',
  },
  'assistedliving-enhance-morning.webp': {
    caption: 'Assisted Living — Morning',
    alt: 'Assisted living facility, morning rendering',
  },
  'fourstory-enhanced.webp': { caption: 'Four-Story Building', alt: 'Four-story building exterior rendering' },
  'harpoon-willys-draft01.webp': {
    caption: "Harpoon Willy's (Draft)",
    alt: "Harpoon Willy's exterior draft rendering",
  },
  'livingwaterchurch-enhanced-day.webp': {
    caption: 'Living Water Church — Day',
    alt: 'Living Water Church, daytime rendering',
  },
  'livingwaterchurch-enhanced-evening.webp': {
    caption: 'Living Water Church — Evening',
    alt: 'Living Water Church, evening rendering',
  },
  'pnc-bridgewater-enhanced01.webp': {
    caption: 'PNC Bridgewater',
    alt: 'PNC Bridgewater exterior rendering, variant 1',
  },
  'pnc-bridgewater-enhanced02.webp': {
    caption: 'PNC Bridgewater (Alt)',
    alt: 'PNC Bridgewater exterior rendering, variant 2',
  },
  'pnc01-enhanced-morning.webp': { caption: 'PNC — Morning', alt: 'PNC exterior rendering, morning' },
  'pricechopper01-enhanced.webp': { caption: 'Price Chopper', alt: 'Price Chopper exterior rendering' },
  'rider-enhanced.webp': { caption: 'Rider', alt: 'Rider building exterior rendering' },
  'brunswicktownship-day.webp': {
    caption: 'Brunswick Township — Day',
    alt: 'Brunswick Township exterior rendering, daytime',
  },
  'brunswicktownship-night.webp': {
    caption: 'Brunswick Township — Night',
    alt: 'Brunswick Township exterior rendering, night',
  },
  'coastal01.webp': { caption: 'Coastal — 1', alt: 'Coastal-style exterior rendering, variant 1' },
  'cpastal02.webp': { caption: 'Coastal — 2', alt: 'Coastal-style exterior rendering, variant 2' },
  'conshohocken01.webp': { caption: 'Conshohocken', alt: 'Conshohocken exterior rendering' },
  'craftsman01.webp': { caption: 'Craftsman', alt: 'Craftsman-style exterior rendering' },
  'toll01.webp': { caption: 'Toll — 01', alt: 'Toll exterior rendering 1' },
  'toll02.webp': { caption: 'Toll — 02', alt: 'Toll exterior rendering 2' },
  'toll03.webp': { caption: 'Toll — 03', alt: 'Toll exterior rendering 3' },
  'toll04.webp': { caption: 'Toll — 04', alt: 'Toll exterior rendering 4' },
  'toll05.webp': { caption: 'Toll — 05', alt: 'Toll exterior rendering 5' },
  'toll06.webp': { caption: 'Toll — 06', alt: 'Toll exterior rendering 6' },
  'toll07.webp': { caption: 'Toll — 07', alt: 'Toll exterior rendering 7' },
  'walker01-day.webp': { caption: 'Walker — Day', alt: 'Walker exterior rendering, daytime' },
  'walker01-evening.webp': { caption: 'Walker — Evening', alt: 'Walker exterior rendering, evening' },
}

const printsCaptions = {
  'photo-oct-07-4-18-49-pm.webp': {
    caption: 'Assembled Floorplan Model — Overview',
    alt: '3D-printed architectural floorplan model, assembled, overview angle',
  },
  'photo-oct-07-4-18-57-pm.webp': {
    caption: 'Assembled Floorplan Model — Underside',
    alt: '3D-printed architectural floorplan model, assembled, underside angle',
  },
  'photo-oct-07-4-19-09-pm.webp': {
    caption: 'Assembled Floorplan Model — Detail',
    alt: '3D-printed architectural floorplan model, assembled, detail angle',
  },
  'photo-oct-07-4-19-13-pm.webp': {
    caption: 'Assembled Floorplan Model — Top View',
    alt: '3D-printed architectural floorplan model, assembled, top-down view of unit labels',
  },
  'photo-oct-07-4-20-09-pm.webp': {
    caption: 'Assembled Floorplan Model — Close Detail',
    alt: '3D-printed architectural floorplan model, close-up of unit labels',
  },
  'photo-oct-07-4-20-15-pm.webp': {
    caption: 'Assembled Floorplan Model — Wing Detail',
    alt: '3D-printed architectural floorplan model, close-up of a building wing',
  },
  'photo-oct-07-4-20-29-pm.webp': {
    caption: 'Assembled Floorplan Model — Wing Detail (Alt)',
    alt: '3D-printed architectural floorplan model, alternate close-up of a building wing',
  },
  'photo-oct-07-4-23-55-pm.webp': {
    caption: 'Floorplan Tiles — Unsorted Layout',
    alt: 'Individual 3D-printed floorplan tiles laid out unassembled on a table',
  },
  'photo-oct-07-4-23-59-pm.webp': {
    caption: 'Floorplan Tiles — Detail',
    alt: 'Close-up of individual 3D-printed floorplan tiles laid out on a table',
  },
  'photo-oct-07-4-24-05-pm.webp': {
    caption: 'Floorplan Tiles — Full Layout',
    alt: 'Full layout of individual 3D-printed floorplan tiles on a table',
  },
  'photo-oct-07-4-24-08-pm.webp': {
    caption: 'Floorplan Tiles — Close Detail',
    alt: 'Close-up detail of individual 3D-printed floorplan tiles on a table',
  },
}

// Miscellaneous 3D prints — a separate model from the condominium floorplan
// above, shown in its own stacked thumbnail rail (see HudShowcase's
// `stackedRails`). No hand-curated order file needed for just 7 photos.
const printsMiscCaptions = {
  'misc-porch-row-close-up.webp': {
    caption: 'Porch Row — Close-Up',
    alt: '3D-printed model, close-up angle along a row of covered porches',
  },
  'misc-tan-corner-breezeway.webp': {
    caption: 'Tan Corner & Breezeway',
    alt: '3D-printed house model, tan-sided corner with a covered breezeway',
  },
  'misc-open-roof-interior-view.webp': {
    caption: 'Open-Roof Interior View',
    alt: '3D-printed model with the roof removed, showing the interior room layout',
  },
  'misc-brick-clubhouse-front-angle.webp': {
    caption: 'Brick Clubhouse — Front Angle',
    alt: '3D-printed brick clubhouse model, front angle view',
  },
  'misc-brick-tan-corner-detail.webp': {
    caption: 'Brick & Tan Corner Detail',
    alt: '3D-printed model, close-up of a brick-and-tan corner detail',
  },
  'misc-brick-clubhouse-front-view.webp': {
    caption: 'Brick Clubhouse — Front View',
    alt: '3D-printed brick clubhouse model, front view',
  },
  'misc-roof-shingle-sample.webp': {
    caption: 'Roof Shingle Sample',
    alt: 'Close-up of a single 3D-printed roof shingle sample piece',
  },
}

function parseOrderFile(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

function buildOrderedMedia(modules, orderRaw, captionMap, depthModules) {
  const byFilename = {}
  for (const [path, url] of Object.entries(modules)) {
    byFilename[path.split('/').pop()] = url
  }

  const depthByFilename = {}
  if (depthModules) {
    for (const [path, url] of Object.entries(depthModules)) {
      depthByFilename[path.split('/').pop()] = url
    }
  }

  const used = new Set()
  const ordered = []

  for (const name of parseOrderFile(orderRaw)) {
    if (byFilename[name] && !used.has(name)) {
      ordered.push(name)
      used.add(name)
    }
  }
  // Anything on disk but not yet listed in the order file is appended at the
  // end (alphabetically) so a newly-added image is never silently hidden.
  Object.keys(byFilename)
    .sort()
    .forEach((name) => {
      if (!used.has(name)) {
        ordered.push(name)
        used.add(name)
      }
    })

  return ordered.map((name) => {
    const meta = captionMap[name] || {}
    const depthName = name.replace(/\.([a-z0-9]+)$/i, '-depth.$1')
    return {
      type: 'image',
      src: byFilename[name],
      alt: meta.alt || `Project image — ${name}`,
      caption: meta.caption || name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' '),
      ...(depthByFilename[depthName] ? { depthSrc: depthByFilename[depthName] } : {}),
    }
  })
}

function gallery(count, startIndex = 0) {
  return Array.from({ length: count }, (_, i) => ({
    type: 'image',
    src: placeholderAt(startIndex + i),
    alt: 'Placeholder image — replace with real project media',
  }))
}

// AI Assisted Visuals images aren't individually captioned (there are too
// many, and the HUD viewer only ever shows the caption as non-visible
// accessibility text — see ThumbnailRail/ZoomableImage) — a per-category
// label is enough. Sorted alphabetically by filename since there's no
// meaningful hand-curated order within a theme.
function themedGallery(modules, categoryLabel) {
  return Object.keys(modules)
    .sort()
    .map((path) => ({
      type: 'image',
      src: modules[path],
      alt: `${categoryLabel} — AI-assisted image of Ferris`,
      caption: categoryLabel,
    }))
}

const interiorsMedia = buildOrderedMedia(interiorsModules, interiorsOrderRaw, interiorsCaptions)
const exteriorsMedia = buildOrderedMedia(exteriorsModules, exteriorsOrderRaw, exteriorsCaptions, exteriorsDepthModules)
const printsMedia = buildOrderedMedia(printsModules, printsOrderRaw, printsCaptions)
const printsMiscMedia = buildOrderedMedia(printsMiscModules, '', printsMiscCaptions)

const moviesTvMedia = themedGallery(moviesTvModules, 'Movies & TV')
const mythologyMedia = themedGallery(mythologyModules, 'Mythology & Legend')
const natureMedia = themedGallery(natureModules, 'Nature & Creature Mashups')
const everydayMedia = themedGallery(everydayModules, 'Everyday & Occupational')
const retroMedia = themedGallery(retroModules, 'Retro & Music')
const classicArtMedia = themedGallery(classicArtModules, 'Classic Art & Literature')
const gamesMedia = themedGallery(gamesModules, 'Games')
const prehistoricMedia = themedGallery(prehistoricModules, 'Prehistoric & Dinosaurs')
const sportsMedia = themedGallery(sportsModules, 'Sports & Action')
const sciFiMedia = themedGallery(sciFiModules, 'Sci-Fi & Fantasy Worlds')
const foodMedia = themedGallery(foodModules, 'Food & Culture')
const landmarksMedia = themedGallery(landmarksModules, 'Landmarks & Icons')

// Real video episodes for the "Ferris Videos" mode — each has a poster frame
// (extracted via ffmpeg) so the thumbnail rail and <video poster> don't need
// to load/seek the video itself just to show a preview.
const videosMedia = [
  {
    type: 'video',
    src: extremeSportsVideo,
    poster: extremeSportsPoster,
    caption: 'The Most Extreme Dog In The World',
    alt: 'AI-assisted video — The Most Extreme Dog In The World',
  },
  {
    type: 'video',
    src: greekGodsVideo,
    poster: greekGodsPoster,
    caption: 'Gods of Olympus',
    alt: 'AI-assisted video — Gods of Olympus',
  },
  {
    type: 'video',
    src: royalFerrisResortVideo,
    poster: royalFerrisResortPoster,
    caption: 'Royal Ferris Resort',
    alt: 'AI-assisted video — Royal Ferris Resort',
  },
  {
    type: 'video',
    src: ferrisParkVideo,
    poster: ferrisParkPoster,
    caption: 'Ferris Park',
    alt: 'AI-assisted video — Ferris Park',
  },
  {
    type: 'video',
    src: dancingOrangutanVideo,
    poster: dancingOrangutanPoster,
    caption: 'Dancing Orangutan',
    alt: 'AI-assisted video — Dancing Orangutan',
  },
]

// Shared with the 'products' and 'conceptual' project entries below and with
// ferris-video's "Ads" / "Conceptual" modes — defined once here since a
// project object can't reference a sibling entry still being built in the
// same projects[] array literal.
const adsMedia = [
  {
    type: 'video',
    src: charcuterieVideo,
    poster: charcuteriePoster,
    caption: 'Charcuterie',
    alt: 'AI Ads video — Charcuterie',
  },
  {
    type: 'video',
    src: comfortCaninesVideo,
    poster: comfortCaninesPoster,
    caption: 'Comfort Canines',
    alt: 'AI Ads video — Comfort Canines',
  },
  {
    type: 'video',
    src: ferrisBeerCommercialVideo,
    poster: ferrisBeerCommercialPoster,
    caption: 'Ferris Beer Commercial',
    alt: 'AI Ads video — Ferris Beer Commercial',
  },
  {
    type: 'video',
    src: ferrisIceCreamVideo,
    poster: ferrisIceCreamPoster,
    caption: 'Ferris Ice Cream',
    alt: 'AI Ads video — Ferris Ice Cream',
  },
  {
    type: 'video',
    src: milkVideo,
    poster: milkPoster,
    caption: 'Milk',
    alt: 'AI Ads video — Milk',
  },
]
const conceptualMedia = [
  {
    type: 'video',
    src: brickCanvasVideo,
    poster: brickCanvasPoster,
    caption: 'A Brick Canvas',
    alt: 'Conceptual video — A Brick Canvas',
  },
  {
    type: 'video',
    src: connectionsVideo,
    poster: connectionsPoster,
    caption: 'Connections',
    alt: 'Conceptual video — Connections',
  },
  {
    type: 'video',
    src: greenSustainabilityVideo,
    poster: greenSustainabilityPoster,
    caption: 'Green Sustainability',
    alt: 'Conceptual video — Green Sustainability',
  },
]

// The "Ferris Stills" mode's sections — also used as ferris-video's plain
// `sections` (the Home-page card cover image comes from sections[0]).
// Deliberately a single flat section (no category tabs) — previously split
// into 9 theme categories, collapsed back to one long thumbnail rail per
// request. The old per-category arrays are kept and just concatenated here
// (in the same order) so re-splitting into tabs later is a one-line revert.
const ferrisStillsSections = [
  {
    heading: 'Gallery',
    media: [
      ...moviesTvMedia,
      ...sciFiMedia,
      ...mythologyMedia,
      ...everydayMedia,
      ...foodMedia,
      ...landmarksMedia,
      ...natureMedia,
      ...retroMedia,
      ...classicArtMedia,
      ...gamesMedia,
      ...prehistoricMedia,
      ...sportsMedia,
    ],
  },
]

// TODO: sections still using gallery() below are placeholder gradients (src/assets/placeholders)
// because the live site lazy-loads real images/video and they could not be scraped.
// Run `node scripts/import-media.mjs <slug> <section> <files...>` to bring in real
// media (see README), then swap the gallery() call for a real import like `exteriorsMedia`
// above. Any `externalUrl: ''` still needs the real link filled in.

export const INTERACTIVE_STORYBOOK_URL = 'https://storybook-norascolorfulworld.netlify.app/'
export const UPPERCASE_URL = 'https://dak-uppercase.netlify.app/'
export const CODE_BREAKER_URL = 'https://davidakant.github.io/CodeBreaker/'
export const VIDEO_JIGSAW_URL = 'https://dak-videojigsaw.netlify.app/'
export const REALTOR_DASHBOARD_URL = 'https://davidakant.github.io/ThirdPartyDataTest1/'
export const PROJECT_MANAGEMENT_URL = 'https://davidakant.github.io/ConstructionProjectDashboard/'
export const PROJECT_COORDINATION_URL = 'https://coordinator-console.netlify.app/'

export const projects = [
  {
    slug: 'architecture',
    title: 'Architectural Visualization',
    category: '3D RENDERS',
    summary: 'Interior and exterior renderings.',
    description:
      "Don't wait for things to be perfect before you share them with others. Show early and show often.",
    descriptionAttribution: 'Ed Catmull, Pixar co-founder',
    externalUrl: '',
    sections: [
      { heading: 'Interiors & Living Spaces', media: interiorsMedia },
      { heading: 'Exteriors', media: exteriorsMedia },
    ],
  },
  {
    slug: '3d-printing',
    title: '3D Printing',
    category: 'Design & Fabrication',
    summary: 'Three-dimensional design and fabrication experiments.',
    description: 'A collection of 3D-printed objects, from early prototypes to finished pieces.',
    externalUrl: '',
    sections: [
      {
        heading: 'Condominium 3D Floorplan',
        media: [
          {
            type: 'video',
            src: printsAssemblyVideo,
            caption: 'Assembling the Floorplan Model',
            alt: 'Time-lapse video of the 3D-printed floorplan model being assembled',
          },
          ...printsMedia,
        ],
      },
      {
        heading: 'Miscellaneous',
        media: printsMiscMedia,
      },
    ],
  },
  {
    slug: 'products',
    title: 'Products & Services',
    category: 'AI / Commercial',
    summary: 'AI-assisted advertising content for products and services.',
    description: 'Commercial content exploring what AI generation can do for product and service marketing.',
    externalUrl: '',
    sections: [{ heading: 'AI Ads', media: adsMedia }],
  },
  {
    slug: 'storybook',
    title: "Storybook — Nora's Colorful World",
    category: 'Interactive / Narrative',
    summary: 'A draft interactive storybook project, hosted externally.',
    description:
      "Nora's Colorful World is an in-progress narrative project. Follow the link to view the live build.",
    externalUrl: '',
    sections: [{ heading: 'Preview', media: gallery(1, 3) }],
  },
  {
    slug: 'conceptual',
    title: 'Conceptual (Multi-Use)',
    category: 'Concept Design',
    summary: 'Exploratory design work spanning multiple applications and use cases.',
    description: 'A grab-bag of conceptual and speculative design exercises.',
    externalUrl: '',
    sections: [{ heading: 'Concepts', media: conceptualMedia }],
  },
  {
    slug: 'ferris-video',
    title: 'Ferris (AI Video)',
    category: 'AI',
    summary: 'AI-assisted video series starring my dog, Ferris.',
    description:
      'This is my dog, Ferris. These AI-assisted video series are also cross-posted to YouTube.',
    externalUrl: 'https://www.youtube.com/@Ferris-AI',
    externalLabel: 'Watch on YouTube',
    sections: ferrisStillsSections,
    // Top-level content sets shown on the AI Assisted Visuals page, switched
    // via HudShowcase's mode tabs. Each mode has its own category tabs (built
    // the same way as `sections` above).
    modes: [
      { label: 'Ads', sections: [{ heading: 'AI Ads', media: adsMedia }], showCaption: true },
      { label: 'Conceptual', sections: [{ heading: 'Concepts', media: conceptualMedia }], showCaption: true },
      { label: 'Ferris Videos', sections: [{ heading: 'Videos', media: videosMedia }], showCaption: true },
      { label: 'Ferris Stills', sections: ferrisStillsSections },
    ],
  },
  {
    slug: 'ferris-stills',
    title: 'Ferris (AI Stills)',
    category: 'AI Image',
    summary: 'AI-assisted still imagery, same subject as the video series.',
    description: 'Still frames and generated imagery exploring the same character and world as the video series.',
    externalUrl: '',
    sections: [{ heading: 'Stills', media: gallery(6, 5) }],
  },
  {
    slug: 'web-applications',
    title: 'Web Applications',
    category: 'Productivity',
    summary: 'Dashboard web applications for real estate professionals and project management.',
    description: 'Click through to view the live applications.',
    externalUrl: '',
    externalLabel: 'View live app',
    sections: [
      {
        heading: 'Project Coordination',
        media: [
          {
            type: 'image',
            src: projectCoordinationScreenshot,
            alt: 'Project Coordination dashboard showing production pipeline snapshot, risk alerts, and open action items',
            caption: 'Coordinator Console Overview',
            href: PROJECT_COORDINATION_URL,
          },
        ],
      },
      {
        heading: 'Project Management',
        media: [
          {
            type: 'image',
            src: projectManagementScreenshot,
            alt: 'Project management dashboard showing a calendar view and task list',
            caption: 'Calendar & Task Dashboard',
            href: PROJECT_MANAGEMENT_URL,
          },
        ],
      },
      {
        heading: 'Realtor Dashboard',
        media: [
          {
            type: 'image',
            src: realtorDashboardScreenshot,
            alt: 'Realtor dashboard showing parcel map lookup and census demographics data',
            caption: 'Parcel Lookup & Census Demographics',
            href: REALTOR_DASHBOARD_URL,
          },
        ],
      },
    ],
  },
  {
    slug: 'web-games',
    title: 'Web Games',
    category: 'Interactive',
    summary: 'Browser-based game projects — coming soon.',
    description: '',
    externalUrl: '',
    // Placeholder entries — real screenshots/copy to be filled in later (see
    // WebGamesShowcase, styled the same as WebApplicationsShowcase). Interactive
    // Digital Storybook already has its live link + a real cover screenshot.
    sections: [
      {
        heading: 'Interactive Digital Storybook',
        media: [
          {
            type: 'image',
            src: interactiveStorybookScreenshot,
            alt: "Cover art for Nora's Colorful World, an interactive digital storybook",
            href: INTERACTIVE_STORYBOOK_URL,
            // Portrait cover art (roughly 858 × 1253) — overrides MediaGallery's
            // default 4:3 landscape crop so the full cover shows uncropped.
            aspectRatio: '858 / 1253',
            scale: '75%',
          },
        ],
      },
      {
        heading: 'Uppercase',
        media: [
          {
            type: 'image',
            src: uppercaseGameScreenshot,
            alt: 'Gameplay screenshot of Uppercase, a letter-grid word puzzle browser game',
            href: UPPERCASE_URL,
            // Portrait game board (390 × 844) — overrides MediaGallery's
            // default 4:3 landscape crop so the full board shows uncropped.
            aspectRatio: '390 / 844',
            scale: '75%',
          },
        ],
      },
      {
        heading: 'Code Breaker',
        media: [
          {
            type: 'image',
            src: codeBreakerScreenshot,
            alt: 'Screenshot of Code Breaker, a digital-display number-guessing game',
            href: CODE_BREAKER_URL,
            // Portrait game UI (366 × 590) — overrides MediaGallery's default
            // 4:3 landscape crop so the full module shows uncropped.
            aspectRatio: '366 / 590',
            scale: '75%',
          },
        ],
      },
      {
        heading: 'Video Jigsaw',
        media: [
          {
            type: 'image',
            src: videoJigsawScreenshot,
            alt: 'Video Jigsaw gameplay showing scattered puzzle pieces made from a looping dolphin video',
            href: VIDEO_JIGSAW_URL,
            // Landscape gameplay capture (1600 × 1000) — overrides MediaGallery's
            // default 4:3 crop so no scattered pieces get cut off at the edges.
            aspectRatio: '8 / 5',
          },
        ],
      },
    ],
  },
]

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug)
}
