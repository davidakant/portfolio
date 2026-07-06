import HudShowcase from '../components/HudShowcase'

export default function PrintingShowcase() {
  return (
    <HudShowcase
      slug="3d-printing"
      eyebrow="3D PRINTING // DESIGN & FABRICATION ARCHIVE"
      bordered={false}
      showTicker={false}
      dynamicAspect
      stackedRails
      minimal
    />
  )
}
