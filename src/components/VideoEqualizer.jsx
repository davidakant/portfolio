import { useEffect, useRef } from 'react'
import styles from './VideoEqualizer.module.css'

const BAR_COUNT = 12

// Real audio-reactive equalizer — driven by the actual <video>'s audio track
// via the Web Audio API (AnalyserNode reading live frequency data), not a
// decorative random-animation loop like AudioEqualizer. Bars are updated by
// directly writing to the DOM in a rAF loop (not React state) so a ~60fps
// visualization doesn't trigger a React re-render every frame.
//
// The box itself is always shown for a video, paused or not — bars just sit
// at their idle floor (see .eqBar's base `transform` in the CSS) until
// `playing` flips true. `playing` flips true exactly once per mounted video
// (HudShowcase sets it from the same synchronous click handler that calls
// video.play(), so the AudioContext is created within a real user gesture —
// required or it stays permanently "suspended" and the bars never move).
export default function VideoEqualizer({ videoRef, playing }) {
  const barRefs = useRef([])

  useEffect(() => {
    if (!playing) return undefined
    const videoEl = videoRef.current
    if (!videoEl) return undefined

    // Guards a browser/context that lacks the Web Audio API entirely — this
    // is a decorative enhancement, so it should silently no-op (bars stay at
    // their idle floor) rather than throw inside an effect and take down the
    // whole tree (no error boundary wraps this app).
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return undefined
    const audioCtx = new AudioContextClass()
    const source = audioCtx.createMediaElementSource(videoEl)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.75
    source.connect(analyser)
    // createMediaElementSource reroutes the element's audio output through
    // the Web Audio graph instead of straight to the speakers — without this
    // connection the video would go silent.
    analyser.connect(audioCtx.destination)

    const freqData = new Uint8Array(analyser.frequencyBinCount)
    const binsPerBar = Math.floor(freqData.length / BAR_COUNT)
    let rafId

    const tick = () => {
      analyser.getByteFrequencyData(freqData)
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0
        for (let j = 0; j < binsPerBar; j++) sum += freqData[i * binsPerBar + j]
        const level = Math.max(0.06, sum / binsPerBar / 255)
        const bar = barRefs.current[i]
        if (bar) bar.style.transform = `scaleY(${level})`
      }
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      analyser.disconnect()
      source.disconnect()
      audioCtx.close()
    }
  }, [playing, videoRef])

  return (
    <div className={styles.eqBox} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div key={i} ref={(el) => (barRefs.current[i] = el)} className={styles.eqBar} />
      ))}
    </div>
  )
}
