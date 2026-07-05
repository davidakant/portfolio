import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import styles from './ThumbnailRail.module.css'

const THUMB_W = 62 // 9:16 at 110px tall
const GAP = 10
const DIVIDER_W = 40
// Site's container caps at 1400px (tokens.css --container-width), so this is
// a safe upper bound for how much rail width we ever need to fill — avoids
// needing a ResizeObserver just to size the loop buffer.
const ASSUMED_MAX_WIDTH = 1400

export default function ThumbnailRail({ media, activeIndex, onSelect }) {
  // One "set" = all thumbnails for this category plus its trailing divider —
  // the unit that repeats to form the endless loop.
  const setWidth = media.length * (THUMB_W + GAP) + (DIVIDER_W + GAP)
  // Need enough copies on each side of "center" that, even at the extremes
  // of the wrap band below (±0.5 * setWidth), rendered content still fully
  // covers the viewport. `buffer` copies each direction guarantees that.
  const buffer = Math.ceil(ASSUMED_MAX_WIDTH / setWidth) + 2
  const middle = buffer
  const copies = buffer * 2 + 1
  const center = -middle * setWidth

  const x = useMotionValue(center)
  const draggedRef = useRef(false)
  const containerRef = useRef(null)

  // Endless loop: let x drift freely, then silently shift it by exactly one
  // set-width once it strays too far — since adjacent copies are identical,
  // the jump is visually undetectable.
  useMotionValueEvent(x, 'change', (latest) => {
    if (latest > center + setWidth * 0.5) {
      x.set(latest - setWidth)
    } else if (latest < center - setWidth * 0.5) {
      x.set(latest + setWidth)
    }
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      x.set(x.get() - delta)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [x])

  const items = []
  for (let c = 0; c < copies; c++) {
    media.forEach((item, i) => items.push({ type: 'thumb', item, i, key: `t-${c}-${i}` }))
    items.push({ type: 'divider', key: `d-${c}` })
  }

  return (
    <div className={styles.railOuter} ref={containerRef}>
      <motion.div
        className={styles.rail}
        drag="x"
        style={{ x }}
        dragElastic={0.08}
        dragTransition={{ power: 0.28, timeConstant: 200 }}
        onDragStart={() => {
          draggedRef.current = false
        }}
        onDrag={(_, info) => {
          // Native click still fires on release (same element stays under the
          // pointer during a 1:1 drag) — flag real movement here, not in
          // onDragEnd, since the click event fires before onDragEnd runs.
          if (Math.abs(info.offset.x) > 5) draggedRef.current = true
        }}
      >
        {items.map((entry) =>
          entry.type === 'divider' ? (
            <div key={entry.key} className={styles.divider} aria-hidden="true" />
          ) : (
            <button
              key={entry.key}
              className={`${styles.thumb} ${entry.i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => {
                if (draggedRef.current) {
                  draggedRef.current = false
                  return
                }
                onSelect(entry.i)
              }}
              data-cursor-hover
              aria-label={entry.item.caption}
            >
              <img
                src={entry.item.type === 'video' ? entry.item.poster : entry.item.src}
                alt=""
                loading="lazy"
                draggable="false"
              />
            </button>
          ),
        )}
      </motion.div>
    </div>
  )
}
