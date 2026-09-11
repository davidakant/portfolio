import { useEffect, useRef, useState } from 'react'
import { FEATURED_PROJECTS, HOME_CATEGORIES } from '../data/home'
import Cursor from './Cursor'
import styles from './About.module.css'

const EMAIL = 'david.a.kant@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/davidakant'

// Counts and the category list are read from the same arrays the home page
// renders from, so adding or removing a project can't leave a stale sentence
// behind here.
function categoryList() {
  const titles = HOME_CATEGORIES.map((c) => c.title)
  if (titles.length < 2) return titles.join('')
  return `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`
}

// The ⓘ button and its dialog travel together, so the nav only has to place
// one element. Native <dialog> gives Escape, focus trapping and the top
// layer for free — the top layer is also why this needs no portal, unlike
// the home page's film modal.
export default function About() {
  const dialogRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="About this portfolio"
        data-cursor-hover
      >
        &#9432;
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="about-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false)
        }}
      >
        {/* The app's cursor lives in the normal stacking order, so the top
            layer this dialog is promoted into paints over it and the pointer
            vanishes. A second instance mounted in here is in the top layer
            too, so it draws on top; the one underneath is hidden by the
            backdrop anyway. */}
        {open && <Cursor />}

        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.title} id="about-title">
              About this portfolio
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close"
              data-cursor-hover
            >
              &#10005;
            </button>
          </div>

          <p className={styles.text}>
            This is my portfolio. The {FEATURED_PROJECTS.length} featured projects on the home page are
            applications I built end to end, and each one runs live on its own site. Below them are{' '}
            {HOME_CATEGORIES.length} categories of earlier work: {categoryList()}.
          </p>
          <p className={styles.text}>
            I have spent over twenty years making visuals for other people's work: architecture,
            marketing, product, training. What I bring alongside the pictures is the pipeline around
            them, the scripting, the asset management, and the coordination that gets a few hundred
            images out the door on schedule. Several of the applications here are demonstrations built
            for this portfolio rather than client work, and each one says so on its own card.
          </p>

          <div className={styles.byline}>
            <span className={styles.name}>David Kant</span>
            <a className={styles.email} href={`mailto:${EMAIL}`} data-cursor-hover>
              {EMAIL}
            </a>
          </div>
          <div className={styles.links}>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" data-cursor-hover>
              LinkedIn &#8599;
            </a>
          </div>
        </div>
      </dialog>
    </div>
  )
}
