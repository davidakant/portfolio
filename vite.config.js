import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone'

  return {
    plugins: [
      react(),
      obfuscatorPlugin({
        apply: 'build',
        options: {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
          selfDefending: false,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
        },
      }),
      // Only for `npm run build:standalone` — inlines JS/CSS/assets into one
      // index.html with a non-module script tag, so it can be opened via
      // file:// (double-clicked) instead of served over http.
      standalone && viteSingleFile(),
    ],
    // esbuild's CSS minifier (Vite's default) has a bug where it strips the
    // required space between chained filter functions, e.g. turning
    // `blur(24px) saturate(160%)` into `blur(24px)saturate(160%)` — which is
    // invalid CSS, so browsers silently discard the whole declaration.
    // Lightning CSS is a proper AST-based minifier and doesn't have this bug.
    css: {
      transformer: 'lightningcss',
    },
    build: {
      sourcemap: false,
      outDir: standalone ? 'dist-standalone' : 'dist',
      assetsInlineLimit: standalone ? Infinity : undefined,
      cssCodeSplit: !standalone,
      cssMinify: 'lightningcss',
    },
  }
})
