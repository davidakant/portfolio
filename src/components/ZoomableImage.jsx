import { useEffect, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import styles from './ZoomableImage.module.css'

const MIN_SCALE = 1
const MAX_SCALE = 4

export default function ZoomableImage({ src, alt, containerRef, onNaturalSize }) {
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [zoomed, setZoomed] = useState(false)
  // Portrait images fit by height instead of covering the (landscape) panel,
  // so they don't get cropped down to a thin vertical sliver — the panel's
  // own glass background shows through on the sides instead.
  const [isPortrait, setIsPortrait] = useState(false)

  useMotionValueEvent(scale, 'change', (v) => setZoomed(v > 1.02))

  // Reset pan/zoom whenever the displayed image changes.
  useEffect(() => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }, [src, scale, x, y])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.get() - e.deltaY * 0.0015))
      scale.set(next)
      if (next <= MIN_SCALE) {
        x.set(0)
        y.set(0)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [containerRef, scale, x, y])

  return (
    <motion.div
      className={styles.zoomLayer}
      style={{ scale, x, y }}
      drag={zoomed}
      dragConstraints={containerRef}
      dragElastic={0.1}
      onDoubleClick={() => {
        scale.set(1)
        x.set(0)
        y.set(0)
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable="false"
        className={isPortrait ? styles.portrait : undefined}
        onLoad={(e) => {
          setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)
          onNaturalSize?.(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
        }}
      />
    </motion.div>
  )
}
