import styles from './Footer.module.css'

const EMAIL = 'david.a.kant@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/davidakant'

// The one place the dark driftwood tone is used as a field: a slim strip
// under every page for the sand at the bottom of the shoreline to rest on.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <span className={styles.name}>David Kant</span>
        <span className={styles.links}>
          <a className={styles.email} href={`mailto:${EMAIL}`} data-cursor-hover>
            {EMAIL}
          </a>
          <a
            className={styles.linkedin}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
          >
            LinkedIn &#8599;
          </a>
        </span>
      </div>
    </footer>
  )
}
