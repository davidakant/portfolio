import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'
import styles from './HudFeaturedCard.module.css'

export default function HudFeaturedCard({ project, index = 0, mx, my }) {
  const cover = project.sections[0]?.media.find((item) => item.type !== 'video')?.src

  // Tilts toward the cursor using the same page-wide mouse tracking as the
  // HudDisplay panel on the Architecture page — one shared mx/my source, so
  // every card in the grid tilts in sync rather than reacting individually.
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 })

  // Randomized per card (picked once on mount) so the shimmer sweeps don't
  // all stay in lockstep across the grid.
  const shimmer = useMemo(
    () => ({
      '--shimmer-delay': `${(Math.random() * 6).toFixed(2)}s`,
      '--shimmer-duration': `${(5 + Math.random() * 4).toFixed(2)}s`,
    }),
    [],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <Link to={`/work/${project.slug}`} className={styles.card} data-cursor-hover>
        <motion.div className={styles.panel} style={{ rotateX, rotateY, transformPerspective: 1200 }}>
          <div className={styles.media}>
            {cover ? (
              <img src={cover} alt="" className={styles.image} loading="lazy" />
            ) : (
              <div className={styles.placeholder} />
            )}
            <div className={styles.sheen} style={shimmer} aria-hidden="true" />
          </div>
        </motion.div>
        <div className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.category}>{project.category}</span>
        </div>
      </Link>
    </motion.div>
  )
}
