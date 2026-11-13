"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { FeaturedProject } from "@/lib/site";

/** `image` is null when the file isn't in /public yet. */
export type PanelProject = Omit<FeaturedProject, "image"> & { image: string | null };

type PanelState = "equal" | "open" | "closed";

/**
 * Full-screen project panels split by diagonal cuts: side by side on large
 * screens, stacked on phones. They start equal; opening one grows it to 80%
 * with its details, and the others shrink to 10% showing just their name.
 * The diagonal shapes are in globals.css (.project-panels).
 */
export function ProjectPanels({ projects }: { projects: PanelProject[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const toggles = useRef<(HTMLButtonElement | null)[]>([]);
  const closes = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpen = useRef<number | null>(null);
  const baseId = useId();

  // Move focus into an opened project, and back to its panel when it closes.
  useEffect(() => {
    if (open !== null) {
      closes.current[open]?.focus({ preventScroll: true });
      lastOpen.current = open;
    } else if (lastOpen.current !== null) {
      toggles.current[lastOpen.current]?.focus({ preventScroll: true });
      lastOpen.current = null;
    }
  }, [open]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open !== null) setOpen(null);
  }

  return (
    <div
      onKeyDown={onKeyDown}
      className="project-panels flex h-[calc(100svh-5rem)] min-h-[32rem] flex-col lg:h-[calc(100svh-6rem)] lg:flex-row"
    >
      {projects.map((project, i) => {
        const state: PanelState = open === null ? "equal" : open === i ? "open" : "closed";
        const id = `${baseId}-${i}`;
        return (
          <article
            key={project.name}
            aria-labelledby={`${id}-name`}
            className="project-panel group/panel relative min-h-0 min-w-0 basis-0 overflow-hidden bg-deep-base transition-[flex-grow] duration-700 ease-out-soft motion-reduce:transition-none"
            style={{ flexGrow: state === "open" ? 8 : 1 }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(min-width: 64rem) 80vw, 100vw"
                className={cn(
                  "object-cover transition-transform duration-700 ease-out motion-reduce:transition-none",
                  state !== "open" && "group-hover/panel:scale-105",
                )}
                style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
              />
            ) : null}
            {/* Shade for legible text: light when browsing, deeper when open. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-deep-base/90 via-deep-base/35 to-deep-base/10"
            />
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-deep-base transition-opacity duration-500",
                state === "open" ? "opacity-55" : state === "closed" ? "opacity-30" : "opacity-0",
              )}
            />

            {state !== "open" && (
              <h3 id={`${id}-name`} className="sr-only">
                {project.name}
              </h3>
            )}

            {/* Browsing: the whole panel opens the project. */}
            {state !== "open" && (
              <button
                ref={(el) => {
                  toggles.current[i] = el;
                }}
                type="button"
                onClick={() => setOpen(i)}
                aria-expanded={false}
                aria-controls={`${id}-details`}
                className="absolute inset-0 text-left text-white focus-visible:outline-offset-[-6px]"
              >
                <span className="sr-only">Show project details: {project.name}</span>

                {/* Equal panels: name and location. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 pb-[calc(var(--cut)+1.25rem)] transition-opacity duration-300 lg:pr-[calc(var(--cut)+1.25rem)] lg:pb-10 lg:pl-10",
                    state === "equal" ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span>
                    <span className="block font-heading text-xl font-semibold sm:text-2xl">
                      {project.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
                      <Icon name="pin" className="size-4 shrink-0" />
                      {project.location}
                    </span>
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors duration-200 group-hover/panel:border-white group-hover/panel:bg-white group-hover/panel:text-deep-base">
                    <Icon name="plus" className="size-5" />
                  </span>
                </span>

                {/* Shrunk panels: just the name, sideways on large screens. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 flex items-center px-6 transition-opacity duration-300 lg:justify-center lg:px-0",
                    state === "closed" ? "opacity-100 delay-300" : "opacity-0",
                  )}
                >
                  <span className="font-heading text-base font-semibold whitespace-nowrap sm:text-lg lg:rotate-180 lg:[writing-mode:vertical-rl]">
                    {project.name}
                  </span>
                </span>
              </button>
            )}

            {/* Open: the project's details. Always rendered, so the figures
                count up only the first time a project is opened. */}
            <div
              id={`${id}-details`}
              className={cn(
                "absolute inset-0 flex-col overflow-y-auto px-6 pt-[calc(var(--cut)+3.5rem)] pb-[calc(var(--cut)+1.5rem)] text-white sm:px-10 lg:pt-24 lg:pr-[calc(var(--cut)+1.5rem)] lg:pb-12 lg:pl-[calc(var(--cut)*0.75+1.5rem)]",
                state === "open" ? "flex" : "hidden",
              )}
            >
              <div className="mt-auto max-w-4xl animate-[rise-in_0.6s_var(--ease-out-soft)_0.35s_both] motion-reduce:animate-none">
                <Details project={project} nameId={`${id}-name`} open={state === "open"} />
              </div>
            </div>

            {state === "open" && (
              <button
                ref={(el) => {
                  closes.current[i] = el;
                }}
                type="button"
                onClick={() => setOpen(null)}
                aria-expanded={true}
                aria-controls={`${id}-details`}
                className="absolute top-[calc(var(--cut)+0.5rem)] right-4 flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-deep-base lg:top-6 lg:right-6"
              >
                <span className="sr-only">Close {project.name}</span>
                <Icon name="close" className="size-5" />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Details({
  project,
  nameId,
  open,
}: {
  project: PanelProject;
  nameId: string;
  open: boolean;
}) {
  // Small screens show one of these at a time so the panel fits the screen.
  const [shown, setShown] = useState(0);
  const story = [
    { label: "The problem", tab: "Problem", text: project.problem },
    { label: "What we did", tab: "What we did", text: project.work },
    { label: "The result", tab: "Result", text: project.result },
  ];

  return (
    <>
      {open && (
        <h3 id={nameId} className="font-heading text-2xl font-semibold sm:text-3xl lg:text-4xl">
          {project.name}
        </h3>
      )}
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/75">
        <Icon name="pin" className="size-4 shrink-0" />
        {project.location}
      </p>

      {/* Small screens: pick one of the three; large screens show them all. */}
      <div
        role="group"
        aria-label="Project details"
        className="mt-5 flex gap-5 border-b border-white/20 lg:hidden"
      >
        {story.map((item, i) => (
          <button
            key={item.tab}
            type="button"
            aria-pressed={i === shown}
            onClick={() => setShown(i)}
            className={cn(
              "relative -mb-px rounded-[2px] pt-1 pb-2.5 font-heading text-xs font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200",
              "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-light-green after:transition-transform after:duration-300 motion-reduce:after:transition-none",
              i === shown
                ? "text-light-green after:scale-x-100"
                : "text-white/60 after:scale-x-0 hover:text-white",
            )}
          >
            {item.tab}
          </button>
        ))}
      </div>
      <dl className="mt-3 grid lg:mt-8 lg:grid-cols-3 lg:gap-8">
        {story.map((item, i) => (
          <div
            key={item.label}
            className={cn("max-lg:col-start-1 max-lg:row-start-1", i !== shown && "max-lg:invisible")}
          >
            <dt className="font-heading text-xs font-semibold tracking-[0.14em] text-light-green uppercase max-lg:sr-only">
              {item.label}
            </dt>
            <dd className="leading-relaxed text-white/85 lg:mt-2 lg:text-[0.9375rem]">{item.text}</dd>
          </div>
        ))}
      </dl>

      <ul className="@container mt-6 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 lg:mt-8 lg:pt-6">
        {project.figures.map((figure) => (
          <li key={figure.label}>
            <span className="flex flex-wrap items-baseline gap-x-1 gap-y-1 font-heading text-[clamp(1.125rem,7cqi,2.25rem)] leading-none font-bold whitespace-nowrap">
              <CountUp value={figure.value} className="tabular-nums" />
              {figure.unit && <span className="text-[0.55em] font-semibold">{figure.unit}</span>}
            </span>
            <span className="mt-2 block text-[0.8125rem] leading-snug text-white/70">
              {figure.label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/gallery"
        className="mt-5 inline-block rounded-[2px] font-heading text-[0.9375rem] font-semibold text-light-green underline-offset-4 hover:underline lg:mt-7"
      >
        View project
        <span className="sr-only">: {project.name}</span>
      </Link>
    </>
  );
}
