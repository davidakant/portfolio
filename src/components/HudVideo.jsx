import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './HudVideo.module.css'

// Big centered "liquid glass" play button overlaid on a paused video. Clicking
// it starts playback and pops the button away (scale + fade, like a soap
// bubble) — it's a one-shot affordance, not a play/pause toggle, so it never
// comes back for this mounted video (the parent keys the whole video block by
// `active.src`, so a genuinely different/reloaded video gets a fresh mount
// and thus a fresh button).
//
// `videoRef` is owned by the parent (HudShowcase) rather than created here,
// since VideoEqualizer also needs it to attach a Web Audio analyser.
// `onPlay` fires synchronously inside the same click handler as
// `videoRef.current.play()` so the parent can set up that AudioContext
// within the same user gesture — required, or it stays permanently
// suspended.
export default function HudVideo({ src, poster, caption, videoRef, onPlay, onNaturalSize }) {
  const [showButton, setShowButton] = useState(true)

  const handlePlay = () => {
    videoRef.current?.play()
    onPlay?.()
    setShowButton(false)
  }

  return (
    <>
      <video
        ref={videoRef}
        className={styles.videoFill}
        src={src}
        poster={poster}
        controls
        playsInline
        onLoadedMetadata={
          onNaturalSize ? (e) => onNaturalSize(e.currentTarget.videoWidth, e.currentTarget.videoHeight) : undefined
        }
      />
      <AnimatePresence>
        {showButton && (
          <motion.button
            className={styles.playButton}
            onClick={handlePlay}
            initial={false}
            exit={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-hover
            aria-label="Play video"
          >
            <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      {caption && (
        <div className={styles.caption}>
          <span className={styles.captionLabel}>{caption}</span>
        </div>
      )}
    </>
  )
}
