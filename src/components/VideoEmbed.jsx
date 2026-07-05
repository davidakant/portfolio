import styles from './VideoEmbed.module.css'

export default function VideoEmbed({ youtubeId, src, poster }) {
  if (youtubeId) {
    return (
      <div className={styles.frameWrap}>
        <iframe
          className={styles.frame}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title="Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (src) {
    return <video src={src} poster={poster} controls playsInline />
  }

  return <div className={styles.placeholder}>Video pending</div>
}
