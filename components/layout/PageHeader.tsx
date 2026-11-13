import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Top of an inner page. The nav is see-through until the page scrolls, so a dark
 * band the nav's height (h-20, lg:h-28 in Nav.tsx) sits behind it. The title is
 * kept for screen readers and search engines but not shown: visitors know which
 * page they opened. `showTitle` brings back the full title band, with its intro,
 * for pages that do need to say where you are, like the 404 page.
 */
export function PageHeader({
  title,
  intro,
  showTitle = false,
}: {
  title: string;
  intro?: ReactNode;
  showTitle?: boolean;
}) {
  if (!showTitle) {
    return (
      <div className="h-20 bg-deep-base lg:h-28">
        <h1 className="sr-only">{title}</h1>
      </div>
    );
  }

  return (
    <section className="on-dark bg-deep-base pt-36 pb-16 text-white sm:pt-44 sm:pb-20">
      <Container>
        <span aria-hidden="true" className="mb-6 block h-1 w-12 bg-brand-green" />
        <h1 className="text-4xl leading-tight font-bold tracking-[-0.015em] sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-white/75">{intro}</p>}
      </Container>
    </section>
  );
}

/** Body for pages that are still to be written. */
export function PlaceholderBody({ children }: { children: ReactNode }) {
  return (
    <section className="bg-off-white py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl border border-dashed border-mid-grey/45 bg-white p-8 font-heading font-semibold text-mid-grey">
          {children}
        </div>
      </Container>
    </section>
  );
}
