"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { GalleryProject } from "@/lib/gallery";
import { PhotoDialog, type ProjectPhoto } from "./ProjectPhotos";

export type StripProject = Omit<GalleryProject, "hero" | "photos" | "folder"> & {
  /** null when the file isn't in /public. */
  hero: { src: string; position?: string } | null;
  photos: ProjectPhoto[];
};

/**
 * The shading over a strip's photos: deepest on the left, where the text sits,
 * and deeper again once the project is open. Every slide gets the same, so
 * they match (and the photos' soft detail doesn't show), except that on
 * smaller screens the photo slides (`photo`), which have no text over them,
 * get about half as much, so the photos can be seen.
 */
function Shade({ open, photo = false }: { open: boolean; photo?: boolean }) {
  if (photo) {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-deep-base/50 via-deep-base/40 to-deep-base/30 lg:hidden"
        />
        <div className="absolute inset-0 max-lg:hidden">
          <Shade open={open} />
        </div>
      </>
    );
  }
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-deep-base/90 via-deep-base/60 to-deep-base/20 max-lg:via-deep-base/70 max-lg:to-deep-base/45"
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-linear-to-r from-deep-base/70 via-deep-base/45 to-transparent transition-opacity duration-700 max-lg:from-deep-base/60 max-lg:via-deep-base/50 max-lg:to-deep-base/35 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
}

const arrowClass =
  "pointer-events-auto flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-deep-base/60 text-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-green hover:bg-brand-green hover:text-deep-base lg:size-12";

/**
 * One project as a full-width photo strip, styled like the homepage project
 * panels: name, location and figures over the photo. Selecting the strip opens
 * the write-up beneath it, over the same photo.
 *
 * Open, the project is a row of slides. The first is the intro photo with the
 * name and write-up; each of the project's other photos is a slide of its own,
 * shown whole with nothing over it. Arrows (at the sides on large screens, at
 * the bottom on smaller ones), the arrow keys or a swipe move between them, and
 * any photo opens full size. Closing goes back to the first slide. The
 * diagonal cuts between strips are in globals.css (.project-strips).
 */
export function GalleryStrip({ project }: { project: StripProject }) {
  const [open, setOpen] = useState(false);
  // The other photos only load once the project has been opened.
  const [opened, setOpened] = useState(false);
  /** 0 is the intro slide; 1 onwards are the project's other photos. */
  const [index, setIndex] = useState(0);
  // The full-size window only renders its photo while it's open.
  const [viewing, setViewing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  // Set when a touch ended in a swipe, so the tap that follows doesn't close.
  const swiped = useRef(false);
  const headingId = `${project.id}-heading`;
  const detailsId = `${project.id}-details`;

  const count = 1 + project.photos.length;
  const step = (by: number) => setIndex((i) => (i + by + count) % count);
  const caption = index > 0 ? project.photos[index - 1].alt : "";

  // Full size shows every photo, the intro one first. Without an intro photo,
  // the intro slide has nothing to show, so it opens the first of the others.
  const heroPhoto: ProjectPhoto | null = project.hero
    ? { src: project.hero.src, alt: "", position: project.hero.position }
    : null;
  const fullSize = heroPhoto ? [heroPhoto, ...project.photos] : project.photos;
  const fullSizeIndex = heroPhoto ? index : Math.max(0, index - 1);
  const stepFullSize = (by: number) =>
    heroPhoto ? step(by) : setIndex((i) => ((Math.max(0, i - 1) + by + fullSize.length) % fullSize.length) + 1);

  function toggle() {
    if (open) setIndex(0);
    setOpen(!open);
    setOpened(true);
  }

  /** A click or tap on the strip or a photo: opens or closes, unless it ended a swipe. */
  function onSelect() {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    toggle();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!open || count < 2) return;
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: PointerEvent) {
    swiped.current = false;
    if (open && event.pointerType === "touch") swipeStart.current = { x: event.clientX, y: event.clientY };
  }
  function onPointerUp(event: PointerEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || count < 2) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  }

  return (
    <article
      id={project.id}
      aria-labelledby={headingId}
      onKeyDown={onKeyDown}
      className="project-strip group/strip relative bg-deep-base text-white"
    >
      {/* The slides, side by side; the row slides along to the one showing. */}
      <div
        className="touch-pan-y overflow-clip"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        <div
          className="flex transition-[translate] duration-700 ease-out-soft motion-reduce:transition-none"
          style={{ translate: `${-index * 100}% 0` }}
        >
          {/* The intro slide: the strip, and the write-up once it's open. */}
          <div inert={index !== 0} className="relative w-full shrink-0">
            {project.hero && (
              <Image
                src={project.hero.src}
                alt=""
                fill
                sizes="100vw"
                className={cn(
                  "object-cover transition-[scale] duration-700 ease-out motion-reduce:transition-none",
                  !open && "group-hover/strip:scale-105",
                )}
                style={project.hero.position ? { objectPosition: project.hero.position } : undefined}
              />
            )}
            <Shade open={open} />

            {/* The strip itself. */}
            <div className="relative h-64 lg:h-72">
              {/* The whole strip opens and closes the project. */}
              <button
                type="button"
                onClick={onSelect}
                aria-expanded={open}
                aria-controls={detailsId}
                className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-6px]"
              >
                <span className="sr-only">
                  {open ? "Hide" : "Show"} details and photos: {project.name}
                </span>
              </button>

              {/* Over the button but click-through, so the text can be a real heading. */}
              <div className="project-strip-content pointer-events-none relative z-20 mx-auto flex h-full max-w-7xl items-center gap-6 px-4 pt-[calc(var(--cut)+0.5rem)] pb-[calc(var(--cut)+1rem)] sm:px-6 lg:pt-[var(--cut)] lg:pb-[var(--cut)]">
                <div className="min-w-0 flex-1">
                  {project.location && (
                    <p className="flex items-center gap-1.5 text-sm text-white/75">
                      <Icon name="pin" className="size-4 shrink-0" />
                      {project.location}
                    </p>
                  )}
                  <h2
                    id={headingId}
                    className="mt-1.5 font-heading text-2xl leading-tight font-bold tracking-[-0.01em] sm:text-3xl lg:text-4xl"
                  >
                    {project.name}
                  </h2>
                  {project.figures ? (
                    <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 lg:mt-5 lg:gap-x-12">
                      {project.figures.map((figure) => (
                        <li key={figure.label}>
                          <span className="flex items-baseline gap-1 font-heading text-[1.75rem] leading-none font-bold whitespace-nowrap lg:text-4xl">
                            <CountUp value={figure.value} className="tabular-nums" />
                            {figure.unit && (
                              <span className="text-[0.55em] font-semibold">{figure.unit}</span>
                            )}
                          </span>
                          <span className="mt-1.5 block text-[0.8125rem] leading-snug text-white/70">
                            {figure.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // No figures to show: the work carried out instead.
                    <p className="mt-3 font-heading text-sm font-semibold text-light-green lg:mt-4 lg:text-base">
                      {project.subtitle ?? project.services.join(" · ")}
                    </p>
                  )}
                </div>

                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center self-end rounded-full border transition-colors duration-200 sm:self-center lg:size-12",
                    open
                      ? "border-white bg-white text-deep-base"
                      : "border-white/50 bg-deep-base/40 backdrop-blur-sm group-hover/strip:border-white group-hover/strip:bg-white group-hover/strip:text-deep-base",
                  )}
                >
                  <Icon
                    name="plus"
                    className={cn(
                      "size-5 transition-transform duration-300 motion-reduce:transition-none",
                      open && "rotate-45",
                    )}
                  />
                </span>
              </div>
            </div>

            {/* The write-up: slides open beneath the strip. Inert while closed,
                so it can't be reached with the keyboard. */}
            <div
              id={detailsId}
              inert={!open}
              className="relative grid transition-[grid-template-rows] duration-700 ease-out-soft motion-reduce:transition-none"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-clip">
                {/* The name (and any subtitle) is already in the strip above.
                    Room at the bottom for the photo controls. */}
                <div className="project-strip-content mx-auto max-w-7xl px-4 pt-2 pb-[calc(var(--cut)+6rem)] sm:px-6 lg:pt-0">
                  <div className="max-w-3xl space-y-4 leading-relaxed text-white/90 sm:text-lg sm:leading-relaxed">
                    {project.description.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <ul aria-label="Work carried out" className="mt-6 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <li
                        key={service}
                        className="border border-white/20 px-3 py-1.5 font-heading text-xs font-semibold text-light-green"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* The other photos, a slide each: full width and shaded like the
              intro photo, with no text over them. Like the strip, a click or
              tap on one closes the project (the close button in the corner
              does the same for keyboards and screen readers). */}
          {opened &&
            project.photos.map((photo) => (
              <div
                key={photo.src}
                aria-hidden="true"
                onClick={onSelect}
                className="relative w-full shrink-0 cursor-pointer"
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={photo.position ? { objectPosition: photo.position } : undefined}
                />
                <Shade open photo />
              </div>
            ))}
        </div>
      </div>

      {/* The controls stay put while the slides move. */}

      {/* Large screens: arrows on either side, halfway down. */}
      {count > 1 && (
        <div
          inert={!open}
          className={cn(
            "pointer-events-none absolute inset-x-4 inset-y-0 z-30 hidden items-center justify-between transition-opacity duration-500 lg:flex",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <button type="button" onClick={() => step(-1)} className={arrowClass}>
            <span className="sr-only">Previous photo</span>
            <Icon name="arrow-left" className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} className={arrowClass}>
            <span className="sr-only">Next photo</span>
            <Icon name="arrow-right" className="size-5" />
          </button>
        </div>
      )}

      {/* On a photo, the strip's close button has slid away with the intro: one
          of its own, in the top corner. */}
      <button
        type="button"
        onClick={toggle}
        inert={!open || index === 0}
        aria-controls={detailsId}
        className={cn(
          "absolute top-[calc(var(--cut)+0.75rem)] right-4 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white bg-white text-deep-base transition-opacity duration-300 lg:right-6 lg:size-12",
          open && index > 0 ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span className="sr-only">Close {project.name}</span>
        <Icon name="close" className="size-5" />
      </button>

      {/* Which photo, its caption, and full size; the arrows too on smaller screens. */}
      <div
        inert={!open}
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-[calc(var(--cut)+0.75rem)] z-30 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="project-strip-content mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
          {count > 1 && (
            <button type="button" onClick={() => step(-1)} className={cn(arrowClass, "lg:hidden")}>
              <span className="sr-only">Previous photo</span>
              <Icon name="arrow-left" className="size-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p
              aria-live="polite"
              className="pointer-events-auto w-fit max-w-full rounded-[2px] bg-deep-base/70 px-3 py-2 text-sm leading-snug text-white/80 backdrop-blur-sm"
            >
              <span className="font-heading font-semibold whitespace-nowrap text-white">
                <span className="sr-only">Photo </span>
                {index + 1} / {count}
              </span>
              {/* The caption shows in full size; over the photo, just the count. */}
              {caption && <span className="sr-only">: {caption}</span>}
            </p>
          </div>
          {count > 1 && (
            <button type="button" onClick={() => step(1)} className={cn(arrowClass, "lg:hidden")}>
              <span className="sr-only">Next photo</span>
              <Icon name="arrow-right" className="size-5" />
            </button>
          )}
          {fullSize.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setViewing(true);
                dialogRef.current?.showModal();
              }}
              aria-haspopup="dialog"
              className="pointer-events-auto flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-deep-base/60 px-4 font-heading text-sm font-semibold backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white hover:text-deep-base max-sm:px-3 lg:min-h-12"
            >
              <Icon name="fit" className="size-4" />
              <span className="max-sm:sr-only">Full size</span>
            </button>
          )}
        </div>
      </div>

      {opened && fullSize.length > 0 && (
        <PhotoDialog
          dialogRef={dialogRef}
          photos={fullSize}
          index={fullSizeIndex}
          open={viewing}
          onClose={() => setViewing(false)}
          onStep={stepFullSize}
          projectName={project.name}
        />
      )}
    </article>
  );
}
