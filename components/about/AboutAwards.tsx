import { AwardCards } from "@/components/home/Awards";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The homepage awards, on a light background. */
export function AboutAwards() {
  return (
    <section aria-labelledby="about-awards-heading" className="bg-off-white py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal className="max-w-2xl">
          <SectionHeading id="about-awards-heading" className="text-deep-base">
            <span className="whitespace-nowrap">Award-winning</span> work
          </SectionHeading>
          <p className="mt-5 text-lg text-charcoal">
            Recognised at the North West Energy Efficiency Regional Awards.
          </p>
        </Reveal>

        <AwardCards tone="light" className="mt-12 lg:mt-16" />
      </Container>
    </section>
  );
}
