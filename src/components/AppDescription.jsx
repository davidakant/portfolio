import styles from './AppDescription.module.css'

// Shared layout for project write-ups on the Web Applications / Web Games
// pages: a bold intro sentence flush against a bullet list of labeled
// callouts, then a "Description:"-labeled paragraph set apart by extra
// space. Page-wide scheme is white + cyan; pink (via `highlight`) is
// reserved only for a single deliberate accent phrase, not used for
// section-to-section differentiation. Optional `note` (e.g. a draft/WIP
// disclaimer) renders above everything else by default (`notePosition="top"`,
// e.g. Web Games' Storybook draft note), or after the Description paragraph
// via `notePosition="bottom"` (the Web Applications page's red disclaimers).
export default function AppDescription({
  note,
  noteColor = 'magenta',
  notePosition = 'top',
  intro,
  bullets,
  final,
  highlight,
}) {
  const noteEl = note && <p className={noteColor === 'red' ? styles.noteRed : styles.noteMagenta}>{note}</p>

  return (
    <div className={styles.appDescription}>
      {notePosition === 'top' && noteEl}
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
      {notePosition === 'bottom' && noteEl}
    </div>
  )
}
