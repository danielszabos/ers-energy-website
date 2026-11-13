import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoofToSolar } from "@/components/services/roof-to-solar/RoofToSolar";
import { ServiceDetails } from "@/components/services/ServiceDetails";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

// Same grid and cards as the homepage's "What we do". Each card opens a window
// with that service's details; the homepage cards link to /services#solar-pv etc.,
// which opens the matching window on arrival.
export default function ServicesPage() {
  return (
    <>
      <PageHeader title="Services" />
      <RoofToSolar />
      <section aria-labelledby="services-heading" className="bg-white py-20 sm:py-24 lg:py-32">
        <Container>
          {/* The heading takes the first grid cell, so seven cards fill a 2×4 / 4×2 grid. */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            <Reveal className="pb-3 sm:pr-4 sm:pb-0">
              <SectionHeading id="services-heading" className="text-deep-base">
                Services
              </SectionHeading>
            </Reveal>

            {services.map((service, i) => (
              // Stagger by column so the second row doesn't wait on the first.
              <ServiceDetails key={service.id} service={service} delay={((i + 1) % 4) * 80} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
