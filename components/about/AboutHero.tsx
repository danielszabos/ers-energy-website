import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { versionedPublicFile } from "@/lib/assets";

const IMAGE = "/about/hero.jpg";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

/** A shorter version of the homepage hero: a photo under the same shading. */
export function AboutHero() {
  const image = versionedPublicFile(IMAGE);

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="on-dark relative isolate flex min-h-[max(26rem,55svh)] flex-col overflow-hidden bg-deep-base text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            // Portrait photo in a wide band: keep the roofers (upper middle) in frame.
            className="object-cover object-[50%_22%]"
          />
        ) : (
          <div className="flex size-full items-start justify-end bg-[radial-gradient(ellipse_at_70%_30%,var(--color-charcoal),var(--color-deep-base)_70%)] p-6 pt-24 font-heading text-xs font-semibold text-white/50 lg:pt-32">
            [Hero image: /about/hero.jpg]
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
            id="about-hero-heading"
            className="hero-enter font-heading text-[clamp(2.375rem,5.5vw,4.25rem)] leading-[1.04] font-bold tracking-[-0.02em]"
            style={delay(150)}
          >
            Why one contractor?
          </h1>
          <p
            className="hero-enter mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
            style={delay(300)}
          >
            The story behind ERS Energy and the approach that sets it apart.
          </p>
        </div>
      </Container>
    </section>
  );
}
