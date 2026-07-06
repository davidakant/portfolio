import HudShowcase from '../components/HudShowcase'

export default function ArchitectureShowcase() {
  return (
    <HudShowcase
      slug="architecture"
      eyebrow="ARCHITECTURAL VISUALIZATION // RENDER ARCHIVE"
      categoryOrder={['EXTERIORS', 'INTERIORS']}
      bordered={false}
      showTicker={false}
      dynamicAspect
      minimal
    />
  )
}
