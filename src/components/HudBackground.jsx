import { useSpring, useTransform, motion } from 'framer-motion'
import styles from './HudBackground.module.css'

export default function HudBackground({ mx, my }) {
  const gridX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 50, damping: 20 })
  const gridY = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 50, damping: 20 })

  return (
    <div className={styles.bg} aria-hidden="true">
      <motion.div className={styles.gridPlane} style={{ x: gridX, y: gridY }} />
    </div>
  )
}
