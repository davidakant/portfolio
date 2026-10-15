import AmbientField from './AmbientField'
import styles from './HudBackground.module.css'

export default function HudBackground() {
  return (
    <div className={styles.bg} aria-hidden="true">
      <AmbientField />
    </div>
  )
}
