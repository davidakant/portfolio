import { useEffect, useRef } from 'react'
import styles from './AmbientField.module.css'

// Soft green light fields drifting behind everything, drawn by the page
// rather than shipped as image files — a few hundred bytes of code instead
// of a few hundred KB of PNGs, at any viewport size, and it never tiles or
// repeats. Composited with 'lighter' so overlapping fields bloom where they
// cross. The canvas stays transparent (clearRect, not fillRect) so the
// page's own radial-gradient ground still shows through underneath.
//
// Deliberately cheap, because this runs on every page and iPad is the
// primary target: device pixel ratio is capped at 1.5, the loop is throttled
// to ~30fps (the fields drift slowly enough that 60 buys nothing), and it
// stops entirely when the tab is hidden or the visitor asks for reduced
// motion — in which case a single static frame is drawn instead.
const FIELDS = [
  { hue: 152, sat: 72, x: 0.18, y: 0.22, r: 0.52, ax: 0.055, ay: 0.04, sx: 0.019, sy: 0.013, a: 0.12 },
  { hue: 152, sat: 72, x: 0.82, y: 0.68, r: 0.46, ax: 0.05, ay: 0.05, sx: 0.011, sy: 0.017, a: 0.1 },
  { hue: 92, sat: 62, x: 0.62, y: 0.14, r: 0.38, ax: 0.06, ay: 0.035, sx: 0.023, sy: 0.009, a: 0.08 },
  { hue: 92, sat: 62, x: 0.3, y: 0.85, r: 0.34, ax: 0.045, ay: 0.045, sx: 0.008, sy: 0.021, a: 0.07 },
  { hue: 168, sat: 55, x: 0.95, y: 0.32, r: 0.3, ax: 0.04, ay: 0.05, sx: 0.015, sy: 0.012, a: 0.06 },
]

const FRAME_MS = 1000 / 30

export default function AmbientField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const draw = (t) => {
      const { width: w, height: h } = canvas
      const min = Math.min(w, h)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      FIELDS.forEach((f, i) => {
        const cx = (f.x + Math.sin(t * f.sx + i) * f.ax) * w
        const cy = (f.y + Math.cos(t * f.sy + i * 1.7) * f.ay) * h
        const r = f.r * min
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `hsla(${f.hue}, ${f.sat}%, 52%, ${f.a})`)
        g.addColorStop(0.45, `hsla(${f.hue}, ${f.sat}%, 44%, ${f.a * 0.4})`)
        g.addColorStop(1, `hsla(${f.hue}, ${f.sat}%, 40%, 0)`)
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
    const onVisibility = () => (document.hidden ? stop() : start())

    start()
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
