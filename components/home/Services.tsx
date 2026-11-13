import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";

// The homepage shows the main services; the rest are on the Services page.
const mainServiceIds = ["commercial-roofing", "solar-pv", "battery-storage"];
const mainServices = services.filter((service) => mainServiceIds.includes(service.id));

export function Services() {
  return (
    <section aria-labelledby="services-heading" className="bg-white py-20 sm:py-24 lg:py-32">
      <Container>
        {/* The heading takes the first grid cell, so three cards fill a 2×2 / 4×1 grid.
            On phones the cards lie flat (icon beside the text) to fit one screen. */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          <Reveal className="pb-3 sm:col-start-1 sm:row-start-1 sm:self-start sm:pr-4 sm:pb-0">
            <SectionHeading id="services-heading" className="text-deep-base">
              What we do
            </SectionHeading>
          </Reveal>

          {mainServices.map((service, i) => (
            <Reveal key={service.id} delay={(i + 1) * 80} className="h-full">
              <ServiceCard service={service} href={`/services#${service.id}`} />
            </Reveal>
          ))}

          {/* Phones: under the cards. Larger screens: the bottom of the heading's cell. */}
          <Reveal
            delay={80}
            className="mt-5 flex justify-center sm:col-start-1 sm:row-start-1 sm:mt-0 sm:justify-start sm:self-end"
          >
            <ButtonLink href="/services" variant="outline-dark">
              View all services
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
