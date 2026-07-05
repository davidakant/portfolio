import { motion } from 'framer-motion'
import VideoEmbed from './VideoEmbed'
import styles from './MediaGallery.module.css'

export default function MediaGallery({ media, columns, children }) {
  if (!media?.length) return null

  return (
    <div className={styles.gallery} style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}>
      {media.map((item, index) => (
        <motion.figure
          key={index}
          className={styles.item}
          style={item.scale ? { width: item.scale } : undefined}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {item.type === 'video' ? (
            <VideoEmbed youtubeId={item.youtubeId} src={item.src} poster={item.poster} />
          ) : item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.mediaLink} data-cursor-hover>
              <img
                src={item.src}
                alt={item.alt ?? ''}
                loading="lazy"
                style={item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}
              />
            </a>
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ''}
              loading="lazy"
              style={item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}
            />
          )}
          {item.caption && (
            <figcaption>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.captionLink} data-cursor-hover>
                  {item.caption}
                </a>
              ) : (
                item.caption
              )}
            </figcaption>
          )}
        </motion.figure>
      ))}
      {children}
    </div>
  )
}
