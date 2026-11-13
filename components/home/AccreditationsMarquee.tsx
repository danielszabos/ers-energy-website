import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

const trackClass =
  "marquee-track flex min-w-full shrink-0 items-center justify-around gap-x-16 pr-16 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:px-4 motion-reduce:gap-x-10";

/**
 * Two identical lists side by side, each sliding left by its own width, so the
 * loop is seamless at any screen size. It pauses on hover. With reduced motion
 * the first list becomes a static wrapped grid and the copy is removed.
 */
export function AccreditationsMarquee({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Container>{heading}</Container>
      <div className="marquee mt-7 flex overflow-hidden motion-reduce:block motion-reduce:overflow-visible">
        <ul className={trackClass}>{children}</ul>
        <ul className={`${trackClass} motion-reduce:hidden`} aria-hidden="true" inert>
          {children}
        </ul>
      </div>
    </>
  );
}
