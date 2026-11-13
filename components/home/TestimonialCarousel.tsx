"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { testimonials as allTestimonials } from "@/lib/site";

type Testimonial = (typeof allTestimonials)[number];

const arrowClass =
  "flex size-12 shrink-0 items-center justify-center rounded-full border border-border-grey bg-white text-deep-base shadow-card transition-colors duration-200 hover:border-deep-base hover:bg-deep-base hover:text-white";

/**
 * One testimonial at a time, changed with the arrows, dots, arrow keys or a
 * swipe. All of them share one spot, so the card stays the same size whichever
 * is showing; the change is a short cross-fade. Long quotes are cut to a few
 * lines with a "Read more" button, so the section still fits on one screen.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const count = testimonials.length;

  function go(index: number) {
    setCurrent((index + count) % count);
    setExpanded(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") go(current - 1);
    else if (event.key === "ArrowRight") go(current + 1);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === "touch") swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Testimonials" onKeyDown={onKeyDown}>
      <div
        aria-live="polite"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        className="grid touch-pan-y"
      >
        {testimonials.map((testimonial, i) => (
          <figure
            key={testimonial.name}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={cn(
              "col-start-1 row-start-1 flex flex-col border border-border-grey bg-white p-6 transition-opacity duration-500 ease-out sm:p-8 lg:p-10 motion-reduce:transition-none",
              i === current ? "opacity-100" : "invisible opacity-0",
            )}
          >
            <span className="flex size-11 items-center justify-center bg-green-tint text-deep-green">
              <Icon name="quote" className="size-6" />
            </span>
            <Quote
              paragraphs={testimonial.quote}
              expanded={i === current && expanded}
              onToggle={() => setExpanded((open) => !open)}
            />
            <figcaption className="mt-auto pt-8">
              <div className="border-t border-border-grey pt-5">
                <p className="font-heading font-semibold text-deep-base">{testimonial.name}</p>
                <p className="mt-0.5 text-sm text-mid-grey">{testimonial.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button type="button" onClick={() => go(current - 1)} className={arrowClass}>
          <span className="sr-only">Previous testimonial</span>
          <Icon name="arrow-right" className="size-5 rotate-180" />
        </button>
        <div role="group" aria-label="Choose a testimonial" className="flex items-center gap-1">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => go(i)}
              aria-current={i === current ? "true" : undefined}
              className="group flex size-6 items-center justify-center rounded-full"
            >
              <span className="sr-only">
                Testimonial {i + 1} of {count}: {testimonial.name}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                  i === current ? "w-6 bg-deep-green" : "w-2 bg-border-grey group-hover:bg-mid-grey",
                )}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(current + 1)} className={arrowClass}>
          <span className="sr-only">Next testimonial</span>
          <Icon name="arrow-right" className="size-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * The quote, cut to seven lines (with a fade) when it's longer than that, plus
 * a "Read more" button. The cut only applies once JS is running, so without it
 * the whole quote shows. Screen readers always get the full text.
 */
function Quote({
  paragraphs,
  expanded,
  onToggle,
}: {
  paragraphs: string[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLQuoteElement>(null);
  const id = useId();
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const [long, setLong] = useState(false);

  // Measure on load and whenever the width changes the line count.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setFullHeight(el.scrollHeight);
      setLong(el.scrollHeight > lineHeight * 7 + 2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <blockquote
        ref={ref}
        id={id}
        className={cn(
          "mt-6 grid gap-4 overflow-hidden leading-relaxed text-charcoal transition-[max-height] duration-500 ease-out sm:text-lg sm:leading-relaxed motion-reduce:transition-none in-[.js]:max-h-[7lh]",
          long && !expanded && "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]",
        )}
        style={expanded && fullHeight ? { maxHeight: fullHeight } : undefined}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={id}
          className="mt-3 self-start rounded-[2px] font-heading text-sm font-semibold text-deep-green underline-offset-4 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );
}
