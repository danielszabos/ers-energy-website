"use client";

import { useEffect, useRef } from "react";

const DURATION = 1000;

/** Splits "[6,000] m²" into the text around the number and the number itself. */
function parse(value: string) {
  const match = /\d[\d,]*(?:\.\d+)?/.exec(value);
  if (!match) return null;
  const digits = match[0];
  const decimals = digits.split(".")[1]?.length ?? 0;
  return {
    before: value.slice(0, match.index),
    after: value.slice(match.index + digits.length),
    target: Number(digits.replaceAll(",", "")),
    format: new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: digits.includes(","),
    }),
  };
}

/**
 * Counts the number inside `value` up from 0 the first time it comes fully
 * into view (scrolled to, or slid in by a carousel), keeping any surrounding
 * text. It doesn't count again until the page is reloaded.
 * The page renders the final value, so it is what shows without JS, with
 * reduced motion, and to screen readers. A value with no digits stays as is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Update React's own text node so React and the animation never disagree.
    const text = ref.current?.firstChild;
    const parts = parse(value);
    if (!(text instanceof Text) || !parts) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const show = (n: number) => {
      text.data = parts.before + parts.format.format(n) + parts.after;
    };
    show(0);

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.99) return;
        // Count once per page load; after that the number stays put.
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          if (t === 1) {
            text.data = value;
            return;
          }
          show(parts.target * (1 - (1 - t) ** 3));
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: [0, 1], rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(text.parentElement!);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      text.data = value;
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
