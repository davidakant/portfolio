import { useEffect, useRef } from 'react'
import styles from './AmbientField.module.css'

// Soft light drifting over the page, drawn by the page rather than shipped
// as image files: a few hundred bytes of code instead of a few hundred KB of
// PNGs, at any viewport size, and it never tiles or repeats.
//
// It follows the shoreline ground (see --shoreline in tokens.css): each field
// has a water color and a sand color and is blended between them by how far
// down the page the visitor has scrolled, so the light is blue-green over the
// water and warm over the sand. Blended in RGB, because blending hue would
// pass through a muddy green on the way from blue to sand. Fields are painted
// normally at low opacity; additive blending would bleach the sand to white.
// The same progress value is published as --shore on the parent element so
// HudBackground's grid plane can fade out on the sand.
//
// Deliberately cheap, because this runs on every page and iPad is the
// primary target: device pixel ratio is capped at 1.5, the loop is throttled
// to ~30fps (the fields drift slowly enough that 60 buys nothing), and it
// stops entirely when the tab is hidden or the visitor asks for reduced
// motion, in which case frames are drawn only when the page scrolls.
const FIELDS = [
  { water: [140, 205, 211], sand: [247, 239, 228], x: 0.16, y: 0.24, r: 0.5, ax: 0.055, ay: 0.04, sx: 0.019, sy: 0.013, a: [0.14, 0.2] },
  { water: [63, 155, 176], sand: [241, 223, 203], x: 0.82, y: 0.34, r: 0.46, ax: 0.05, ay: 0.05, sx: 0.011, sy: 0.017, a: [0.16, 0.22] },
  { water: [247, 239, 228], sand: [255, 249, 238], x: 0.86, y: 0.04, r: 0.4, ax: 0.03, ay: 0.02, sx: 0.012, sy: 0.009, a: [0.08, 0.28] },
  { water: [231, 201, 179], sand: [231, 201, 179], x: 0.3, y: 1.02, r: 0.56, ax: 0.08, ay: 0.02, sx: 0.008, sy: 0.012, a: [0.08, 0.24] },
  { water: [31, 107, 138], sand: [140, 205, 211], x: 0.62, y: 0.7, r: 0.34, ax: 0.06, ay: 0.035, sx: 0.023, sy: 0.009, a: [0.12, 0.07] },
]

const FRAME_MS = 1000 / 30

const mix = (a, b, t) => a + (b - a) * t

// 0 at the top of the page, 1 once the visitor is on the sand. Eased and
// held back until a quarter of the way down, which lines the color change up
// with the foam line in --shoreline.
function shoreProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return 0
  const p = Math.min(1, Math.max(0, window.scrollY / max))
  const t = Math.min(1, Math.max(0, (p - 0.25) / 0.6))
  return t * t * (3 - 2 * t)
}

export default function AmbientField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const host = canvas.parentElement

    let lastShore = -1
    const draw = (t) => {
      const { width: w, height: h } = canvas
      const min = Math.min(w, h)
      const s = shoreProgress()
      const rounded = Math.round(s * 100) / 100
      if (host && rounded !== lastShore) {
        host.style.setProperty('--shore', String(rounded))
        lastShore = rounded
      }
      ctx.clearRect(0, 0, w, h)
      FIELDS.forEach((f, i) => {
        const rgb = [0, 1, 2].map((c) => Math.round(mix(f.water[c], f.sand[c], s))).join(', ')
        const a = mix(f.a[0], f.a[1], s)
        const cx = (f.x + Math.sin(t * f.sx + i) * f.ax) * w
        const cy = (f.y + Math.cos(t * f.sy + i * 1.7) * f.ay) * h
        const r = f.r * min
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${rgb}, ${a.toFixed(3)})`)
        g.addColorStop(0.5, `rgba(${rgb}, ${(a * 0.45).toFixed(3)})`)
        g.addColorStop(1, `rgba(${rgb}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    let elapsed = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      draw(elapsed)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = null
    let last = 0
    const loop = (now) => {
      frame = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      elapsed += FRAME_MS / 1000
      draw(elapsed)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = null
    }
    const start = () => {
      if (frame || reduced.matches || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const onVisibility = () => (document.hidden || reduced.matches ? stop() : start())

    // With the loop stopped, the colors still have to follow the scroll.
    const onScroll = () => {
      if (!frame) draw(elapsed)
    }

    start()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
