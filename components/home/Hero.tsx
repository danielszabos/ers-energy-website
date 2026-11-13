import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { hasPublicFile } from "@/lib/assets";
import { HeroMedia } from "./HeroMedia";

const VIDEO = "/videos/hero.mp4";
const POSTER = "/videos/hero-poster.jpg";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative isolate flex min-h-svh flex-col overflow-hidden bg-deep-base text-white"
    >
      <HeroMedia
        video={hasPublicFile(VIDEO) ? VIDEO : null}
        poster={hasPublicFile(POSTER) ? POSTER : null}
      />

      {/* A light overall dim, plus shade only where text sits: a band behind
          the nav and a gradient behind the copy (see globals.css). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-video-shade/15" />
      <div aria-hidden="true" className="hero-top-shade absolute inset-x-0 top-0 -z-10 h-48" />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <Container className="flex flex-1 flex-col justify-end pt-32 pb-28 sm:pb-32 lg:pb-36">
        <div className="max-w-4xl">
          <h1
            id="hero-heading"
            className="hero-enter font-heading text-[clamp(2.375rem,6vw,4.75rem)] leading-[1.04] font-bold tracking-[-0.02em]"
            style={delay(150)}
          >
            Commercial roofing and solar, from one contractor.
          </h1>
          <p
            className="hero-enter mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
            style={delay(300)}
          >
            Award-winning roof refurbishment, repairs and solar PV for industrial and
            commercial buildings across the UK.
          </p>
          <div
            className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row"
            style={delay(450)}
          >
            <ButtonLink href="/services" variant="glass">
              Explore
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
