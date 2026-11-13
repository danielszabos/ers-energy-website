import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/site";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-off-white py-20 sm:py-24 lg:py-32">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading id="testimonials-heading" className="text-deep-base">
            What our clients say
          </SectionHeading>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-8">
          <TestimonialCarousel testimonials={testimonials} />
        </Reveal>
      </Container>
    </section>
  );
}
