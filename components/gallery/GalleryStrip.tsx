"use client";

import Image from "next/image";
import { useState } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { GalleryProject } from "@/lib/gallery";
import { ProjectPhotos, type ProjectPhoto } from "./ProjectPhotos";

export type StripProject = Omit<GalleryProject, "hero" | "photos" | "folder"> & {
  /** null when the file isn't in /public. */
  hero: { src: string; position?: string } | null;
  photos: ProjectPhoto[];
};

/**
 * One project as a full-width photo strip, styled like the homepage project
 * panels: name, location and figures over the photo. Selecting the strip opens
 * the write-up and the rest of the photos beneath it; selecting it again closes
 * them. The diagonal cuts between strips are in globals.css (.project-strips).
 */
export function GalleryStrip({ project }: { project: StripProject }) {
  const [open, setOpen] = useState(false);
  const headingId = `${project.id}-heading`;
  const detailsId = `${project.id}-details`;

  return (
    <article
      id={project.id}
      aria-labelledby={headingId}
      className="project-strip group/strip relative bg-deep-base text-white"
    >
      {/* The strip itself. */}
      <div className="relative h-64 overflow-hidden lg:h-72">
        {project.hero && (
          <Image
            src={project.hero.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/strip:scale-105 motion-reduce:transition-none"
            style={project.hero.position ? { objectPosition: project.hero.position } : undefined}
          />
        )}
        {/* Shade for legible text: deepest on the left, where the text sits. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-deep-base/90 via-deep-base/60 to-deep-base/20 max-lg:via-deep-base/70 max-lg:to-deep-base/45"
        />

        {/* The whole strip opens and closes the project. */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={detailsId}
          className="absolute inset-0 z-10 focus-visible:outline-offset-[-6px]"
        >
          <span className="sr-only">
            {open ? "Hide" : "Show"} details and photos: {project.name}
          </span>
        </button>

        {/* Over the button but click-through, so the text can be a real heading. */}
        <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-7xl items-center gap-6 px-4 pt-[calc(var(--cut)+0.5rem)] pb-[calc(var(--cut)+1rem)] sm:px-6 lg:px-8 lg:pt-[var(--cut)] lg:pb-[var(--cut)]">
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
                      {figure.unit && <span className="text-[0.55em] font-semibold">{figure.unit}</span>}
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

      {/* The rest of the project: slides open beneath the strip. Inert while
          closed, so its photos can't be reached with the keyboard. */}
      <div
        id={detailsId}
        inert={!open}
        className="grid transition-[grid-template-rows] duration-700 ease-out-soft motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-clip">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-[calc(var(--cut)+3rem)] sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pt-14">
            <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
              {project.subtitle && (
                <p className="font-heading text-lg font-semibold text-light-green">
                  {project.subtitle}
                </p>
              )}
              <div
                className={cn(
                  "space-y-4 leading-relaxed text-white/85 sm:text-lg sm:leading-relaxed",
                  project.subtitle && "mt-4",
                )}
              >
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
            <div className="lg:col-span-7">
              <ProjectPhotos photos={project.photos} projectName={project.name} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
