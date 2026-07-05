# David Kant — Portfolio

React + Vite portfolio site. Content is data-driven from `src/data/projects.js`.

## Development

```
npm install
npm run dev
```

## Production build

```
npm run build    # outputs to dist/, minified + obfuscated (see vite.config.js)
npm run preview  # serve the production build locally
```

## Adding real project media

Sections not yet converted still use placeholder gradient images from
`src/assets/placeholders/` (see the TODO at the top of `src/data/projects.js`
for which ones remain).

To bring in real photos/renders for a section:

1. Drop the source JPG/PNG files anywhere in the project root
2. Run:
   ```
   node scripts/import-media.mjs <project-slug> <section-slug> "file1.jpg" "file2.jpg" ...
   ```
   `<project-slug>` and `<section-slug>` are the `slug` and section `heading`
   (kebab-cased) from `src/data/projects.js`, e.g. `architecture` / `exteriors`.
   This script:
   - resizes + converts each file to `.webp` (2400px max width, quality 80) into
     `src/assets/projects/<slug>/<section>/` — what the site actually imports
   - moves the untouched original into `originals/<slug>/<section>/` — a local-only
     backup, gitignored (full-res source images are too large to keep in git; see
     `.gitignore` if you'd rather version them, e.g. with Git LFS)
3. Import the new `.webp` files in `src/data/projects.js` and replace that
   section's `gallery(...)` call with a real media array (see `exteriorsMedia`
   for the pattern — `{ type: 'image', src, alt, caption }`)

For any project with `externalUrl: ''` (Storybook, Realtor Dashboard, Project
Management), fill in the real link. For Ferris AI video clips, either pass a
YouTube video ID to `<VideoEmbed youtubeId="..." />` or a local file via `src`.

**Exception:** the Architecture project's Interiors and Exteriors sections
work differently — see below.

## Reordering the Architecture gallery images

The order images appear in on the Architectural Visualization page (both the
main gallery and the thumbnail rail) is controlled by two plain text files in
the project root, not by editing code:

- `image-order-interiors.txt`
- `image-order-exteriors.txt`

Open either one in Notepad — one image filename per line, top to bottom =
display order. Cut/paste lines around to reorder, save, done. Lines starting
with `#` are comments and are ignored.

If you run `scripts/import-media.mjs` to add a new photo to interiors or
exteriors, it'll show up automatically (appended to the end) even before you
add it to the order file — so nothing gets silently hidden, you just won't
control its position until you add its filename to the list.

(Captions still live in `src/data/projects.js` — in `interiorsCaptions` /
`exteriorsCaptions`, keyed by filename — since renaming a caption isn't the
same task as reordering. A new image not yet in that map just gets a
plain caption generated from its filename until you add one.)

## Deployment

Deploys to Netlify via `netlify.toml` (build command, publish dir, and the SPA
fallback redirect required for client-side routing).

## Local testing by double-clicking (no server)

`npm run dev` / `npm run preview` are the normal ways to view the site and
should be preferred — they're faster and match production. But if you just
want to double-click a file and have it open in a browser with no terminal
involved:

```
npm run build:standalone
```

This produces a single self-contained `dist-standalone/index.html` — open
that file directly. It's a different build target from the real site
(`npm run build`/`dist/`, used for Netlify):

- Everything (JS, CSS, images) is inlined into one HTML file, since browsers
  block loading separate module scripts over `file://`
- It uses hash-based URLs (`#/work` instead of `/work`) instead of clean
  ones, since the History API clean routing needs doesn't work reliably from
  a local file
- It'll be several MB (all images inlined as base64) and regenerates each
  time from the same `src/data/projects.js` — nothing to maintain separately

None of this affects the real deployed site; `npm run build` is unchanged.
