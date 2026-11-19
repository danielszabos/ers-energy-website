"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A list that scrolls sideways (a swipe on touch screens), with a slim bar
 * underneath showing how much of it is in view and how far along it is.
 * `className` sets the list's layout, so it can scroll on phones and become a
 * grid on larger screens; hide the bar at the same breakpoint with
 * `barClassName`. The bar is decoration only: the list itself scrolls.
 */
export function SwipeRow({
  className,
  barClassName,
  children,
}: {
  className?: string;
  barClassName?: string;
  children: ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!list || !thumb) return;

    // The thumb is as wide as the part in view, and moves with the scroll.
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = list;
      if (!scrollWidth || !clientWidth) return;
      thumb.style.width = `${Math.min(100, (clientWidth / scrollWidth) * 100)}%`;
      thumb.style.transform = `translateX(${(scrollLeft / clientWidth) * 100}%)`;
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, []);

  return (
    <>
      <ul ref={listRef} className={cn("swipe-row", className)}>
        {children}
      </ul>
      <div
        aria-hidden="true"
        className={cn("mt-5 h-1 overflow-hidden rounded-full bg-border-grey", barClassName)}
      >
        <span ref={thumbRef} className="block h-full w-1/4 rounded-full bg-deep-green" />
      </div>
    </>
  );
}
