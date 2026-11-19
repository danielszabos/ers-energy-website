"use client";

import { Fragment, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { GalleryCategory } from "@/lib/gallery";

type Filter = GalleryCategory | "all";

/**
 * The gallery's project list: buttons that show only one kind of project
 * (solar, roofing, ...), then the projects. The project strips themselves are
 * rendered on the server and passed in; this only chooses which to show.
 */
export function ProjectExplorer({
  categories,
  projects,
}: {
  categories: { id: GalleryCategory; label: string }[];
  projects: { id: string; categories: GalleryCategory[]; strip: ReactNode }[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const matches = (id: Filter) =>
    id === "all" ? projects : projects.filter((project) => project.categories.includes(id));

  // A button for each kind of work that has projects, with how many.
  const options = [
    { id: "all" as Filter, label: "All", count: projects.length },
    ...categories.map((category) => ({ ...category, count: matches(category.id).length })),
  ].filter((option) => option.count > 0);
  const shown = matches(filter);
  const current = options.find((option) => option.id === filter);

  return (
    <>
      <Container>
        <Reveal>
          <div className="border-t border-border-grey pt-6">
            <div role="group" aria-label="Show projects by type" className="flex flex-wrap gap-2">
              {options.map((option) => {
                const active = option.id === filter;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(option.id)}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 font-heading text-sm font-semibold transition-colors duration-200",
                      active
                        ? "border-deep-base bg-deep-base text-white"
                        : "border-border-grey bg-white text-deep-base hover:border-deep-base",
                    )}
                  >
                    {option.label}
                    <span
                      className={cn(
                        "min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums",
                        active ? "bg-white/15 text-white" : "bg-off-white text-charcoal",
                      )}
                    >
                      <span className="sr-only">(</span>
                      {option.count}
                      <span className="sr-only">)</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Not shown: tells screen reader users what a filter button changed. */}
            <p aria-live="polite" className="sr-only">
              Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
              {filter !== "all" && current ? `: ${current.label}` : ""}
            </p>
          </div>
        </Reveal>
      </Container>

      {/* Full width, edge to edge, like the homepage project panels. Keyed by
          the filter, so a new choice fades in fresh. */}
      <Reveal className="mt-10 lg:mt-12">
        <div
          key={filter}
          className="project-strips animate-[fade-in_0.4s_ease-out_both] motion-reduce:animate-none"
        >
          {shown.map((project) => (
            <Fragment key={project.id}>{project.strip}</Fragment>
          ))}
        </div>
      </Reveal>
    </>
  );
}
