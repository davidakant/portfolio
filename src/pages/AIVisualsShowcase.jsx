import HudShowcase from '../components/HudShowcase'
import { getProjectBySlug } from '../data/projects'

export default function AIVisualsShowcase() {
  return (
    <HudShowcase
      slug="ferris-video"
      eyebrow="AI ASSISTED VISUALS // NEURAL RENDER ARCHIVE"
      modes={getProjectBySlug('ferris-video').modes}
      bordered={false}
      showTicker={false}
      dynamicAspect
      minimal
    />
  )
}
