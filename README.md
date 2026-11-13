# ERS Energy website

Next.js 16 (App Router), TypeScript and Tailwind CSS 4. Every page is prerendered
as static HTML (`ensureStatic = "navigation"` in `app/layout.tsx` fails the build if
that ever changes). No analytics or third-party scripts; fonts are self-hosted by
`next/font`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Deploy by importing the repository into Vercel; no extra settings are needed.

## Where files live

```
public/                     served by the site, as-is
  logo/ers-logo.svg            full-colour logo, for light backgrounds
  logo/ers-logo-white-text.svg white-text logo, used in the nav and footer
  videos/hero.mp4              hero background (web version)
  videos/hero-poster.jpg       first frame of the hero video
  accreditations/              one logo per accreditation (to add)
  projects/                    project photos (to add)
app/icon.svg                the browser tab icon (the logo mark)
source-assets/              originals as supplied; not committed or deployed
  logo/ers-logo-original.svg
  video/hero-original-4k.mp4
```

Keep the masters in `source-assets/` (or in shared storage) and only put
web-ready files in `public/`.

## Adding assets

Drop files into `public/` with these names and rebuild. Anything missing shows a
tidy, clearly bracketed placeholder instead of a broken image. The site reads the
`public/` folder once at startup, so if `npm run dev` is already running,
restart it to pick up new files.

| File | Notes |
| --- | --- |
| `public/accreditations/{slug}.svg` | One per body; `.png`, `.webp` or `.jpg` also work. Slugs: `mcs`, `recc`, `hies`, `trading-standards`, `institute-of-roofing`, `corc`, `chas`, `safecontractor`, `constructionline`, `napit`. |
| `public/projects/project-1.jpg` … `project-3.jpg` | Recent projects cards, ideally 4:3 and at least 1200px wide. |
| `public/about/hero.jpg` | About page hero, behind the heading (shaded dark). Landscape, at least 2000px wide. |
| `public/about/story.jpg` | About page "Our story" photo, shown 4:3. Replace its alt text in `components/about/Story.tsx`. |
| `public/about/mayor-visit.jpg` | About page, the Mayor's visit, shown 4:5. Currently a copy of `about.jpg`. |

## Logo

The two files in `public/logo/` were made from the supplied logo: the white
background was removed, the counter of the R was cut out as a real hole (so the
logo works on any background), and the shapes were grouped for the nav
animation. The supplied file was traced from an image, so its small
"ENERGY LTD" lettering was uneven; it has been reset in Montserrat Regular
(converted to outlines, so it needs no font) in exactly the same position and
width. The groups have these ids, which the draw-in looks for:
`logo-bar-1` and `logo-bar-2` (the green bars, in the order they rise),
`logo-lime` (drops in last) and `logo-text` (fades up). A replacement file
without those ids still animates, as a single piece.

## Placeholder content

Placeholder copy is in square brackets; search the project for `[` to find it.
Project names and descriptions live in `lib/site.ts`, along with all other
homepage content.
The Gallery page's projects, their write-ups and which photos each one shows
live in `lib/gallery.ts`; the photos are in `public/projects/ERS Projects/`.

## Hero video

The web version is 1080p, 24 fps, no audio and no metadata, about 6 MB. To
rebuild it from the master:

```bash
ffmpeg -i source-assets/video/hero-original-4k.mp4 -map 0:v:0 -an -map_metadata -1 \
  -vf "fps=24,scale=1920:1080:flags=lanczos,hqdn3d=2:2:6:6" \
  -c:v libx264 -preset slower -crf 33 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart public/videos/hero.mp4
ffmpeg -i public/videos/hero.mp4 -frames:v 1 -q:v 3 public/videos/hero-poster.jpg
```

The video only plays for visitors who haven't asked for reduced motion or reduced
data, and pauses when the hero is off screen.

## Colours

The palette is defined as Tailwind theme tokens in `app/globals.css`, and the
default Tailwind colours are switched off, so only brand tokens are available
(`bg-deep-base`, `text-deep-green`, …). The usage rules are noted there too.
`rust` and `rust-dark` exist only for the weathered roof in the illustration;
`error` is only for form validation messages.

## Structure

- `app/` routes: the homepage, `/contact`, plus placeholder `/about`, `/services`,
  `/gallery`, `/privacy-policy` and `/terms`. `/services` already has an anchor
  for each homepage service card.
- `/contact` is a step-by-step survey request (`components/contact/`). Its steps,
  dropdown choices and checks are in `lib/survey.ts`; answers go to the server
  action in `app/contact/actions.ts`, which **doesn't send them anywhere yet**
  (they are only logged). Connect it to email or a CRM before launch.
- `components/layout/` shared `Nav`, `Footer` and inner-page header.
- `components/home/` homepage sections. The roof-to-solar scene is in
  `components/home/roof-to-solar/`: the SVG is generated on the server and GSAP
  (loaded on demand) scrubs it while CSS `position: sticky` does the pinning.
- `lib/assets.ts` build-time checks for files in `public/`.
