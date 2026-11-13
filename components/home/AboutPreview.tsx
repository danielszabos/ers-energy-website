import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { versionedPublicFile } from "@/lib/assets";

const IMAGE = "/about/about.jpg";

/** A compact teaser for the About page. */
export function AboutPreview() {
  const image = versionedPublicFile(IMAGE);

  return (
    <section
      aria-labelledby="about-preview-heading"
      className="bg-off-white py-16 sm:py-20 lg:py-24"
    >
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Text first; on large screens the image moves to the left. */}
        <Reveal>
          <p className="font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase">
            About ERS
          </p>
          <SectionHeading id="about-preview-heading" size="compact" className="mt-3 text-deep-base">
            The One Contractor Origin
          </SectionHeading>
          <p className="mt-5 leading-relaxed text-charcoal sm:text-lg sm:leading-relaxed">
            ERS started out as Environmental Roofing Services, refurbishing commercial roofs
            across the North West. Too often, solar systems built to last decades were going onto
            roofs near the end of their life. So ERS brought both services together under one
            roof. The result is one team, one point of contact, and solar that is built to last
            from the ground up.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-[2px] font-heading text-[0.9375rem] font-semibold text-deep-green underline-offset-4 hover:underline"
          >
            Learn more
            <span className="sr-only"> about ERS</span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="lg:order-first">
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden border border-border-grey bg-white sm:aspect-[4/3]">
              {image ? (
                <Image
                  src={image}
                  alt="Andy Burnham standing with two members of the ERS team in the ERS office"
                  fill
                  sizes="(min-width: 80rem) 600px, (min-width: 64rem) 50vw, 100vw"
                  // Portrait photo in a landscape frame: keep the faces in view.
                  className="object-cover object-[50%_35%]"
                />
              ) : (
                <ImagePlaceholder label="[About image: /about/about.jpg]" />
              )}
            </div>
            {image && (
              <figcaption className="mt-3 text-sm leading-snug text-mid-grey">
                Andy Burnham visiting the ERS team, 2022
              </figcaption>
            )}
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
