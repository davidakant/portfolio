import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Nav.module.css'

// One quick-link per home-page category card (see HOME_CATEGORIES in
// pages/Home.jsx) so any page can jump straight to a section without
// detouring through the home grid.
const links = [
  { to: '/work/web-applications', label: 'Web Apps' },
  { to: '/work/architecture', label: 'Architecture' },
  { to: '/work/ferris-video', label: 'AI Visuals' },
  { to: '/work/web-games', label: 'Web Games' },
  { to: '/work/3d-printing', label: '3D Printing' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.nav}>
      <div className={`${styles.inner} container`}>
        <NavLink to="/" className={styles.logo} onClick={() => setOpen(false)}>
          David Kant
        </NavLink>

        <nav className={styles.links}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className={styles.toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={styles.mobileLink} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
