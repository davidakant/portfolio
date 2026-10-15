import HudShowcase from '../components/HudShowcase'

export default function ArchitectureShowcase() {
  return (
    <HudShowcase
      slug="architecture"
      eyebrow="ARCHITECTURAL VISUALIZATION"
      categoryOrder={['EXTERIORS', 'INTERIORS']}
      bordered={false}
      showTicker={false}
      dynamicAspect
      minimal
    />
  )
}
