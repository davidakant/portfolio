import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const canHover = window.matchMedia('(pointer: fine)').matches
    setEnabled(canHover)
    if (!canHover) return

    document.body.classList.add('no-native-cursor')

    const move = (e) => {
      if (!dotRef.current) return
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const over = (e) => {
      setHovering(Boolean(e.target.closest('a, button, [data-cursor-hover]')))
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)

    return () => {
      document.body.classList.remove('no-native-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      className={`${styles.cursor} ${styles.holo} ${hovering ? styles.hovering : ''}`}
      aria-hidden="true"
    />
  )
}
