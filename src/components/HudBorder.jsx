import { useId } from 'react'

// Asymmetric schematic/PCB-trace style HUD frame for card/viewer panels —
// original composition (varying line weight, stepped notches, thick accent
// bars, a disconnected floating tick), not a copy of any specific stock-asset
// artwork.
//
// FRAME_VARIANTS holds several silhouettes from the same family (octagonal
// chamfered corners + one tab notch per edge) but with the notches/chamfers
// placed differently, so a repeated grid of cards doesn't read as the exact
// same frame stamped out multiple times. Each variant's `points` doubles as
// both the SVG outline drawn here AND (via getHudFrameClipPath) the CSS
// clip-path that shapes the image underneath, so the visible image edge and
// the glowing border trace exactly the same line. `accents` positions the
// thick glow bars/dash on that variant's straight edge segments, skipping
// over whichever edge has a notch cut into it.
const FRAME_VARIANTS = [
  {
    points: [
      [5, 0], [35, 0], [35, 4], [43, 4], [43, 0], [95, 0],
      [100, 10], [100, 40], [98, 40], [98, 46], [100, 46], [100, 90],
      [95, 100], [55, 100], [55, 96], [47, 96], [47, 100], [10, 100],
      [0, 90], [0, 10],
    ],
    accents: { left: [10, 90], right: [46, 90], bottom: [78, 95], floating: [48, 63] },
  },
  {
    points: [
      [8, 0], [60, 0], [60, 5], [68, 5], [68, 0], [92, 0],
      [100, 12], [100, 55], [98, 55], [98, 60], [100, 60], [100, 88],
      [92, 100], [45, 100], [45, 95], [37, 95], [37, 100], [8, 100],
      [0, 88], [0, 12],
    ],
    accents: { left: [12, 88], right: [60, 88], bottom: [70, 88], floating: [60, 74] },
  },
  {
    points: [
      [5, 0], [20, 0], [20, 4], [28, 4], [28, 0], [95, 0],
      [100, 10], [100, 90],
      [95, 100], [70, 100], [70, 95], [62, 95], [62, 100], [12, 100],
      [0, 90], [0, 60], [2, 60], [2, 54], [0, 54], [0, 10],
    ],
    accents: { left: [10, 54], right: [10, 90], bottom: [80, 95], floating: [20, 32] },
  },
  {
    points: [
      [6, 0], [45, 0], [45, 3], [53, 3], [53, 0], [94, 0],
      [100, 8], [100, 65], [97, 65], [97, 72], [100, 72], [100, 92],
      [94, 100], [58, 100], [58, 97], [50, 97], [50, 100], [14, 100],
      [0, 92], [0, 8],
    ],
    accents: { left: [8, 92], right: [72, 92], bottom: [76, 94], floating: [45, 58] },
  },
]

function getVariant(variant) {
  const count = FRAME_VARIANTS.length
  return FRAME_VARIANTS[((variant % count) + count) % count]
}

export function getHudFrameClipPath(variant = 0) {
  const { points } = getVariant(variant)
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
}

// Backward-compatible constant (variant 0) for existing single-viewer usage.
export const HUD_FRAME_CLIP_PATH = getHudFrameClipPath(0)

export default function HudBorder({ color = '#7ffcff', className, floatingAccent = true, variant = 0, glass = false }) {
  const { points, accents } = getVariant(variant)
  const pointsAttr = points.map(([x, y]) => `${x},${y}`).join(' ')
  const gradId = useId()
  const strokePaint = glass ? `url(#${gradId}-stroke)` : color

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={{ overflow: 'visible', filter: glass ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.45))' : `drop-shadow(0 0 5px ${color}99)` }}
    >
      {glass && (
        <defs>
          {/* Top-lit/bottom-shaded body fill, same clean/clear "liquid glass"
              recipe used by the HTML badges elsewhere — white only, no color
              tint, so it reads as clear glass rather than tinted plastic. */}
          <linearGradient id={`${gradId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
          </linearGradient>
          {/* Glass edge catching light: bright white rim fading to a dimmer,
              still-white edge — a gradient stroke instead of a flat color. */}
          <linearGradient id={`${gradId}-stroke`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      )}

      {/* soft blurred halo behind the crisp edge — light diffusing through
          the edge of a pane of glass rather than a hard line */}
      {glass && (
        <polygon points={pointsAttr} fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.3" style={{ filter: 'blur(3px)' }} />
      )}

      {/* translucent glass pane filling the schematic silhouette */}
      {glass && <polygon points={pointsAttr} fill={`url(#${gradId}-fill)`} stroke="none" />}

      {/* base outline — matches this variant's clip-path exactly */}
      <polygon points={pointsAttr} fill="none" stroke={strokePaint} strokeWidth={glass ? 1 : 0.6} />

      {/* thick glowing accent bars along whichever edge segments are notch-free */}
      <line x1="0" y1={accents.left[0]} x2="0" y2={accents.left[1]} stroke={strokePaint} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <line x1="100" y1={accents.right[0]} x2="100" y2={accents.right[1]} stroke={strokePaint} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />

      {/* disconnected floating accent dash above the top edge — sits outside this
          box's own bounds by design, so it needs enough clearance above it
          (fine for one large standalone viewer, not for a dense card grid) */}
      {floatingAccent && (
        <line x1={accents.floating[0]} y1="-4" x2={accents.floating[1]} y2="-4" stroke={strokePaint} strokeWidth="1" opacity="0.85" />
      )}

      {/* thick glowing accent bar along the bottom edge */}
      <line x1={accents.bottom[0]} y1="100" x2={accents.bottom[1]} y2="100" stroke={strokePaint} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}
