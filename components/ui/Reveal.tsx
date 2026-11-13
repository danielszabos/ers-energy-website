"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Fades and lifts its content in the first time it scrolls into view.
 * The hidden state lives in globals.css and only applies when JS is running
 * and the visitor hasn't asked for reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.hasAttribute("data-revealed")) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-revealed", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
