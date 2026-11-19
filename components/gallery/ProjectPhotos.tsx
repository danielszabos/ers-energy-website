"use client";

import Image from "next/image";
import type { KeyboardEvent, RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type ProjectPhoto = {
  src: string;
  /** Also the caption. Empty for the project's intro photo. */
  alt: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
};

const arrowClass =
  "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-deep-base/70 text-white backdrop-blur-sm transition-colors hover:border-brand-green hover:bg-brand-green hover:text-deep-base";

/**
 * A project's photos full size, in a native modal <dialog> opened with
 * `dialogRef.current.showModal()`. Arrows (buttons or keys) step through them,
 * and Escape, the close button or a click beside the photo closes it. Which
 * photo shows is up to the caller, so the gallery strip behind stays in step.
 */
export function PhotoDialog({
  dialogRef,
  photos,
  index,
  open,
  onClose,
  onStep,
  projectName,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  photos: ProjectPhoto[];
  index: number;
  /** Whether it's showing. The photo is only rendered while it is. */
  open: boolean;
  onClose: () => void;
  onStep: (by: number) => void;
  projectName: string;
}) {
  const count = photos.length;
  const photo = photos[index];
  const close = () => dialogRef.current?.close();

  const onKeyDown = (event: KeyboardEvent) => {
    // The strip behind listens for arrow keys too.
    event.stopPropagation();
    if (count < 2) return;
    if (event.key === "ArrowLeft") onStep(-1);
    else if (event.key === "ArrowRight") onStep(1);
    else return;
    event.preventDefault();
  };

  return (
    // Full screen. No display class here: a closed <dialog> must stay display: none.
    <dialog
      ref={dialogRef}
      aria-label={`${projectName}: photos`}
      onKeyDown={onKeyDown}
      onClose={onClose}
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
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors hover:text-white"
          >
            <Icon name="close" className="size-6" />
          </button>
        </div>

        {/* A click on the space around the photo closes the window. */}
        <div
          className="relative min-h-0 px-4 sm:px-20"
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          {open && photo && (
            <div
              className="relative size-full"
              onClick={(event) => event.target === event.currentTarget && close()}
            >
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt || projectName}
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
                onClick={() => onStep(-1)}
                aria-label="Previous photo"
                className={cn(arrowClass, "left-2 sm:left-5")}
              >
                <Icon name="arrow-left" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => onStep(1)}
                aria-label="Next photo"
                className={cn(arrowClass, "right-2 sm:right-5")}
              >
                <Icon name="arrow-right" className="size-5" />
              </button>
            </>
          )}
        </div>

        <p
          aria-live="polite"
          className="mx-auto max-w-3xl px-4 py-4 text-center text-sm leading-relaxed text-white/80 sm:py-5 sm:text-base"
        >
          {photo?.alt}
        </p>
      </div>
    </dialog>
  );
}
