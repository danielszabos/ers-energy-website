"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { GalleryPhoto } from "@/lib/gallery";

export type ProjectPhoto = Omit<GalleryPhoto, "file"> & { src: string };

const shapes = {
  wide: "col-span-2 aspect-video",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

const sizes = {
  wide: "(min-width: 80rem) 720px, (min-width: 64rem) 58vw, 100vw",
  square: "(min-width: 80rem) 360px, (min-width: 64rem) 29vw, 50vw",
  tall: "(min-width: 80rem) 360px, (min-width: 64rem) 29vw, 50vw",
};

const arrowClass =
  "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-deep-base/70 text-white backdrop-blur-sm transition-colors hover:border-brand-green hover:bg-brand-green hover:text-deep-base";

/**
 * A project's photos in a grid. Any photo opens full size in a native modal
 * <dialog>: arrows (buttons or keys) step through the project's photos, and
 * Escape, the close button or a click beside the photo closes it.
 */
export function ProjectPhotos({ photos, projectName }: { photos: ProjectPhoto[]; projectName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const photo = photos[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (by: number) => setIndex((i) => (i + by + count) % count);

  const onKeyDown = (event: KeyboardEvent) => {
    if (count < 2) return;
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else return;
    event.preventDefault();
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3">
        {photos.map((p, i) => (
          <li key={p.src} className={shapes[p.shape]}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              className="group relative block size-full overflow-hidden bg-white/5 focus-visible:outline-offset-[-3px]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={sizes[p.shape]}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                style={p.position ? { objectPosition: p.position } : undefined}
              />
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-deep-base/70 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Icon name="plus" className="size-5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Full screen. No display class here: a closed <dialog> must stay display: none. */}
      <dialog
        ref={dialogRef}
        aria-label={`${projectName}: photos`}
        onKeyDown={onKeyDown}
        className="photo-dialog on-dark m-0 size-full max-h-none max-w-none overflow-hidden bg-deep-base p-0 text-white backdrop:bg-deep-base"
      >
        <div className="grid size-full grid-rows-[auto_1fr_auto]">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="min-w-0 truncate font-heading text-sm font-semibold">
              {projectName}
              {count > 1 && (
                <span className="ml-3 font-sans font-normal text-white/60">
                  {index + 1} / {count}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-white/75 transition-colors hover:text-white"
            >
              <Icon name="close" className="size-6" />
            </button>
          </div>

          {/* A click on the space around the photo closes the window. */}
          <div
            className="relative min-h-0 px-4 sm:px-20"
            onClick={(event) => event.target === event.currentTarget && close()}
          >
            {photo && (
              <div
                className="relative size-full"
                onClick={(event) => event.target === event.currentTarget && close()}
              >
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  className="photo-dialog-image object-contain"
                />
              </div>
            )}
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={cn(arrowClass, "left-2 sm:left-5")}
                >
                  <Icon name="arrow-left" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={cn(arrowClass, "right-2 sm:right-5")}
                >
                  <Icon name="arrow-right" className="size-5" />
                </button>
              </>
            )}
          </div>

          <p aria-live="polite" className="mx-auto max-w-3xl px-4 py-4 text-center text-sm leading-relaxed text-white/80 sm:py-5 sm:text-base">
            {photo?.alt}
          </p>
        </div>
      </dialog>
    </>
  );
}
