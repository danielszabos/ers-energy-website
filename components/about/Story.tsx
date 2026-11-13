import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { versionedPublicFile } from "@/lib/assets";

const IMAGE = "/about/story.jpg";

export function Story() {
  const image = versionedPublicFile(IMAGE);

  return (
    <section aria-labelledby="story-heading" className="bg-white py-20 sm:py-24 lg:py-32">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase">
            Our story
          </p>
          <SectionHeading id="story-heading" size="compact" className="mt-3 text-deep-base">
            From roofing to renewables
          </SectionHeading>
          <div className="mt-6 space-y-5 leading-relaxed text-charcoal sm:text-lg sm:leading-relaxed">
            <p>
              ERS started out as Environmental Roofing Services, refurbishing commercial roofs
              across the North West. Over time, the team saw the same problem again and again.
              Businesses were investing in solar systems built to last for decades, only for them
              to be fitted on roofs that were already nearing the end of their life.
            </p>
            <p>
              ERS brought both services together and became ERS Energy. With over 20 years in the
              trade, the team now works on commercial and industrial buildings across the UK from
              its base in Leigh, making sure every building is ready before any solar goes on top.
            </p>
          </div>
        </Reveal>

        {/* Above the text on phones, to its right on large screens. */}
        <Reveal delay={120} className="order-first lg:order-none">
          <div className="relative aspect-[4/3] overflow-hidden border border-border-grey bg-off-white">
            {image ? (
              <Image
                src={image}
                alt="[Describe the story photo]"
                fill
                sizes="(min-width: 80rem) 600px, (min-width: 64rem) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder label="[Story image: /about/story.jpg]" />
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
