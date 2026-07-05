import styles from './AppDescription.module.css'

// Shared layout for project write-ups on the Web Applications / Web Games
// pages: a bold intro sentence flush against a bullet list of labeled
// callouts, then a "Description:"-labeled paragraph set apart by extra
// space. Page-wide scheme is white + cyan; pink (via `highlight`) is
// reserved only for a single deliberate accent phrase, not used for
// section-to-section differentiation. Optional `note` (e.g. a draft/WIP
// disclaimer) renders in magenta above everything else.
export default function AppDescription({ note, intro, bullets, final, highlight }) {
  return (
    <div className={styles.appDescription}>
      {note && <p className={styles.noteMagenta}>{note}</p>}
      <p className={styles.introText}>{intro}</p>
      <ul className={styles.bulletList}>
        {bullets.map((bullet, idx) => (
          <li key={idx}>
            <strong className={styles.descLabel}>{bullet.label}</strong>
            {bullet.text}
          </li>
        ))}
      </ul>
      <p className={styles.finalParagraph}>
        <strong className={styles.descLabel}>Description:</strong>{' '}
        {highlight ? (
          <>
            {highlight.before}
            <span className={styles.highlightMagenta}>{highlight.text}</span>
            {highlight.after}
          </>
        ) : (
          final
        )}
      </p>
    </div>
  )
}
