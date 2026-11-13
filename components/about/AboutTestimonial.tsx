import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/site";

// The same quote as on the homepage, from lib/site.ts.
const testimonial = testimonials.find((t) => t.name === "Simon Hartley");

export function AboutTestimonial() {
  if (!testimonial) return null;

  return (
    <section aria-label="What our clients say" className="bg-white py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <span className="mx-auto flex size-12 items-center justify-center bg-green-tint text-deep-green">
              <Icon name="quote" className="size-6" />
            </span>
            <blockquote className="mt-8 space-y-5 text-lg leading-relaxed text-deep-base sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed">
              {testimonial.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption className="mt-10">
              <span aria-hidden="true" className="mx-auto block h-1 w-12 bg-brand-green" />
              <p className="mt-5 font-heading font-semibold text-deep-base">{testimonial.name}</p>
              <p className="mt-0.5 text-sm text-mid-grey">{testimonial.role}</p>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
