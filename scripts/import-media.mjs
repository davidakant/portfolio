// Organizes newly-added source images into the project's asset pipeline:
//   originals/<slug>/<section>/<original-filename>.jpg   (untouched, gitignored backup)
//   src/assets/projects/<slug>/<section>/<clean-name>.webp (resized, used by the site)
//
// Usage:
//   node scripts/import-media.mjs <project-slug> <section-slug> <file1.jpg> [file2.jpg ...]
//
// Prints a JSON manifest of { original, webp, importPath } so data/projects.js can be updated.

import { mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const MAX_WIDTH = 2400
const QUALITY = 80

function slugify(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase()
}

async function main() {
  const [slug, section, ...files] = process.argv.slice(2)
  if (!slug || !section || files.length === 0) {
    console.error('Usage: node scripts/import-media.mjs <project-slug> <section-slug> <file1.jpg> [...]')
    process.exit(1)
  }

  const root = path.resolve(import.meta.dirname, '..')
  const originalsDir = path.join(root, 'originals', slug, section)
  const webpDir = path.join(root, 'src', 'assets', 'projects', slug, section)

  await mkdir(originalsDir, { recursive: true })
  await mkdir(webpDir, { recursive: true })

  const manifest = []

  for (const file of files) {
    const srcPath = path.resolve(root, file)
    const base = path.basename(file)
    const cleanName = slugify(base)
    const originalDest = path.join(originalsDir, base)
    const webpDest = path.join(webpDir, `${cleanName}.webp`)

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpDest)

    await rename(srcPath, originalDest)

    manifest.push({
      original: path.relative(root, originalDest),
      webp: path.relative(root, webpDest),
      importPath: `../assets/projects/${slug}/${section}/${cleanName}.webp`,
    })
  }

  console.log(JSON.stringify(manifest, null, 2))
}

main()
