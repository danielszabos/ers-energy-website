import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { versionedPublicFile } from "@/lib/assets";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

/**
 * The top of an inner page: a shorter version of the homepage hero, with the
 * page's title and intro over a photo under the same shading. Used on the
 * About and Gallery pages. If the photo isn't in /public yet, a bracketed
 * placeholder shows instead.
 */
export function PageHero({
  id,
  image,
  position,
  title,
  children,
}: {
  /** The heading's id, for the section's aria-labelledby. */
  id: string;
  /** Path in /public, e.g. "/about/hero.jpg". */
  image: string;
  /** CSS object-position, to keep the subject in frame in the wide band. */
  position?: string;
  title: string;
  /** The intro under the title. */
  children: ReactNode;
}) {
  const src = versionedPublicFile(image);

  return (
    <section
      aria-labelledby={id}
      className="on-dark relative isolate flex min-h-[max(26rem,55svh)] flex-col overflow-hidden bg-deep-base text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        ) : (
          <div className="flex size-full items-start justify-end bg-[radial-gradient(ellipse_at_70%_30%,var(--color-charcoal),var(--color-deep-base)_70%)] p-6 pt-24 font-heading text-xs font-semibold text-white/50 lg:pt-32">
            [Hero image: {image}]
          </div>
        )}
      </div>

      {/* Darker than the homepage: the photo here is a backdrop, not the subject. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-video-shade/40" />
      <div aria-hidden="true" className="hero-top-shade absolute inset-x-0 top-0 -z-10 h-48" />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <Container className="flex flex-1 flex-col justify-end pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h1
            id={id}
            className="hero-enter font-heading text-[clamp(2.375rem,5.5vw,4.25rem)] leading-[1.04] font-bold tracking-[-0.02em]"
            style={delay(150)}
          >
            {title}
          </h1>
          <p
            className="hero-enter mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
            style={delay(300)}
          >
            {children}
          </p>
        </div>
      </Container>
    </section>
  );
}
