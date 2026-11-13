// Build-time knowledge of the files in /public, so components can render a
// tidy placeholder instead of a broken image while assets are still to come.
//
// The folder is read when this module loads, not while a page renders:
// Next.js checks render-time work for values that could change between renders,
// and its development checks flag these file reads. During `npm run dev` a
// watcher re-reads it when files change, so new files show up on the next page
// reload; production builds always see the current files.
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const publicDir = path.join(process.cwd(), "public");

export type PublicImage = { src: string; width: number; height: number };

const imageExtensions = ["svg", "png", "webp", "jpg", "jpeg"] as const;

// Folders whose images need their dimensions (logos sized by height) or, for
// SVGs, their markup (the inlined, animated logo).
const measuredFolders = ["/logo/", "/accreditations/"];

function listFiles(dir: string, prefix = ""): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const src = `${prefix}/${entry.name}`;
    return entry.isDirectory() ? listFiles(path.join(dir, entry.name), src) : [src];
  });
}

function loadPublicFolder() {
  // Each file's version: changes whenever the file is replaced or edited.
  const files = new Map<string, string>();
  const images = new Map<string, PublicImage>();
  const svgText = new Map<string, string>();
  if (!fs.existsSync(publicDir)) return { files, images, svgText };

  for (const src of listFiles(publicDir)) {
    try {
      const { mtimeMs, size } = fs.statSync(path.join(publicDir, src));
      files.set(src, Math.round(mtimeMs).toString(36) + size.toString(36));
    } catch {
      continue;
    }
    const extension = src.slice(src.lastIndexOf(".") + 1).toLowerCase();
    if (!measuredFolders.some((folder) => src.startsWith(folder))) continue;
    if (!(imageExtensions as readonly string[]).includes(extension)) continue;
    try {
      const bytes = fs.readFileSync(path.join(publicDir, src));
      const { width, height } = imageSize(bytes);
      if (width && height) images.set(src, { src, width, height });
      if (extension === "svg") svgText.set(src, bytes.toString("utf8"));
    } catch {
      // Unreadable file: treat it as missing.
    }
  }
  return { files, images, svgText };
}

let publicFolder = loadPublicFolder();

if (process.env.NODE_ENV === "development") watchPublicFolder();

function watchPublicFolder() {
  // Kept on globalThis so a hot reload of this module replaces the old watcher.
  const key = Symbol.for("ers.publicFolderWatcher");
  const store = globalThis as unknown as Record<symbol, fs.FSWatcher | undefined>;
  store[key]?.close();
  store[key] = undefined;
  if (!fs.existsSync(publicDir)) return;

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const watcher = fs.watch(publicDir, { recursive: true }, () => {
      // Copying a file fires several events; reload once they settle.
      clearTimeout(timer);
      timer = setTimeout(() => {
        publicFolder = loadPublicFolder();
      }, 150);
    });
    watcher.unref();
    store[key] = watcher;
  } catch {
    // Watching isn't available here: restart `npm run dev` after adding files.
  }
}

export function hasPublicFile(src: string): boolean {
  return publicFolder.files.has(src);
}

/**
 * The file's path with a version that changes whenever the file does, or null
 * if it's missing. Image optimisation caches each URL for hours, so this keeps
 * a replaced photo (same file name) from showing the old picture.
 */
export function versionedPublicFile(src: string): string | null {
  const version = publicFolder.files.get(src);
  return version ? `${src}?v=${version}` : null;
}

/** Markup of an SVG in /public/logo or /public/accreditations. */
export function readPublicSvg(src: string): string | null {
  return publicFolder.svgText.get(src) ?? null;
}

/** Finds `{basePath}.svg|png|webp|jpg|jpeg` in /public with its dimensions. */
export function findPublicImage(basePath: string): PublicImage | null {
  for (const extension of imageExtensions) {
    const image = publicFolder.images.get(`${basePath}.${extension}`);
    if (image) return image;
  }
  return null;
}
