import { useMemo } from 'react'
import styles from './AudioEqualizer.module.css'

const BAR_COUNT = 56

export default function AudioEqualizer() {
  // Computed once per mount so the bars' animation timing stays stable
  // across re-renders (this sits over content that re-renders often).
  const bars = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, () => ({
        duration: (0.5 + Math.random() * 0.9).toFixed(2),
        delay: (Math.random() * -1.6).toFixed(2),
      })),
    [],
  )

  return (
    <div className={styles.eqLayer} aria-hidden="true">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={styles.eqBar}
          style={{ '--dur': `${bar.duration}s`, '--delay': `${bar.delay}s` }}
        />
      ))}
    </div>
  )
}
