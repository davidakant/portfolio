import { useEffect, useRef } from 'react'
import styles from './SpatialImage.module.css'

// "Spatial photo" parallax viewer: displaces each pixel's sample position by
// a per-pixel depth map scaled by mouse position, so near objects shift more
// than far ones — a cheap 2.5D approximation of iOS Spatial Photos, built on
// a single offline monocular depth-map render (see scripts note in projects.js
// wherever depthSrc is set) rather than any real stereo capture.
//
// Only handles the one image it's given — the parent decides when to mount
// this instead of ZoomableImage (see HudShowcase's spatialEnabled toggle).
const STRENGTH = 0.09
const GAMMA = 1.0
// MARGIN must stay >= 2 * STRENGTH (with a little headroom) so the max
// parallax-shifted sample never lands outside [0,1] and clamps/stretches at
// the edges — it scales with STRENGTH, not an independent tuning knob.
const MARGIN = 0.22

const VERT_SRC = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform float uStrength;
uniform float uGamma;
uniform float uMargin;

void main() {
  // Zoom in slightly so parallax-shifted samples never fall outside [0,1]
  // (avoids hard clamped/stretched edges when the "camera" shifts).
  vec2 zoomed = (vUv - 0.5) * (1.0 - uMargin) + 0.5;

  float depth = pow(texture(uDepth, zoomed).r, uGamma); // 0 = far, 1 = near
  vec2 offset = uMouse * uStrength * depth;
  vec2 duv = zoomed + offset;

  outColor = vec4(texture(uColor, duv).rgb, 1.0);
}`

function compile(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log)
  }
  return shader
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export default function SpatialImage({ src, depthSrc, alt, mx, my, onNaturalSize }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    if (!gl) return

    let raf = null
    let disposed = false
    const mouse = [0, 0]
    let idleT = 0

    const program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT_SRC))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uColor = gl.getUniformLocation(program, 'uColor')
    const uDepth = gl.getUniformLocation(program, 'uDepth')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uStrength = gl.getUniformLocation(program, 'uStrength')
    const uGamma = gl.getUniformLocation(program, 'uGamma')
    const uMargin = gl.getUniformLocation(program, 'uMargin')

    function makeTexture() {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return tex
    }
    const colorTex = makeTexture()
    const depthTex = makeTexture()

    let resizeObserver = null

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    function handleMouseLeaveWindow() {
      // No dedicated listener needed — mx/my are shared with the panel tilt
      // and already reset to 0 on mouse-leave by the parent.
    }

    Promise.all([loadImage(src), loadImage(depthSrc)]).then(([colorImg, depthImg]) => {
      if (disposed) return
      gl.bindTexture(gl.TEXTURE_2D, colorTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colorImg)
      gl.bindTexture(gl.TEXTURE_2D, depthTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, depthImg)

      onNaturalSize?.(colorImg.naturalWidth, colorImg.naturalHeight)

      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, colorTex)
      gl.uniform1i(uColor, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, depthTex)
      gl.uniform1i(uDepth, 1)
      gl.uniform1f(uStrength, STRENGTH)
      gl.uniform1f(uGamma, GAMMA)
      gl.uniform1f(uMargin, MARGIN)

      function frame() {
        if (disposed) return
        const targetX = mx?.get() ?? 0
        const targetY = my?.get() ?? 0
        mouse[0] += (targetX * 2 - mouse[0]) * 0.08
        mouse[1] += (-targetY * 2 - mouse[1]) * 0.08

        idleT += 0.005
        const idle = Math.abs(targetX) < 0.01 && Math.abs(targetY) < 0.01
        const mxv = mouse[0] + (idle ? Math.sin(idleT) * 0.15 : 0)
        const myv = mouse[1] + (idle ? Math.cos(idleT * 0.7) * 0.1 : 0)

        gl.uniform2f(uMouse, mxv, myv)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    })

    return () => {
      // Deliberately not forcing WEBGL_lose_context here: React (in dev
      // StrictMode) mounts this effect, cleans it up, then mounts it again
      // on the *same* canvas element — explicitly losing the context would
      // make that second mount permanently fail. Cancelling the loop and
      // observer is enough; the browser reclaims the GL context normally
      // when the canvas element itself is actually removed from the DOM.
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      resizeObserver?.disconnect()
    }
  }, [src, depthSrc, mx, my, onNaturalSize])

  return <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={alt} />
}
