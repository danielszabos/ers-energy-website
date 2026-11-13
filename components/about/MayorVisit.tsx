import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { versionedPublicFile } from "@/lib/assets";

const IMAGE = "/about/mayor-visit.jpg";

export function MayorVisit() {
  const image = versionedPublicFile(IMAGE);

  return (
    <section aria-labelledby="mayor-visit-heading" className="bg-off-white py-20 sm:py-24 lg:py-32">
      <h2 id="mayor-visit-heading" className="sr-only">
        The Mayor&apos;s visit
      </h2>
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden border border-border-grey bg-white">
              {image ? (
                <Image
                  src={image}
                  alt="Andy Burnham standing with two members of the ERS team in the ERS office"
                  fill
                  sizes="(min-width: 80rem) 480px, (min-width: 64rem) 40vw, 448px"
                  className="object-cover object-[50%_40%]"
                />
              ) : (
                <ImagePlaceholder label="[Mayor's visit: /about/mayor-visit.jpg]" />
              )}
            </div>
            <figcaption className="mt-3 text-sm leading-snug text-mid-grey">
              Mayor of Greater Manchester Andy Burnham visiting the ERS team, 2022
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <span aria-hidden="true" className="block h-1 w-12 bg-brand-green" />
          <p className="mt-6 font-heading text-2xl leading-snug font-semibold text-deep-base sm:text-3xl sm:leading-snug lg:text-[2.125rem] lg:leading-snug">
            In 2022, the Mayor of Greater Manchester visited ERS to meet the team and discuss solar
            and the region&apos;s plans for renewable energy.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
