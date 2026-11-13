import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="on-dark relative isolate overflow-hidden bg-deep-base py-20 text-white sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="profile-texture absolute inset-0 -z-10" />
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <SectionHeading id="cta-heading">Planning work on a commercial roof?</SectionHeading>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Tell us about the building and we&apos;ll arrange a survey.
          </p>
        </Reveal>
        <Reveal
          delay={120}
          className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end"
        >
          <ButtonLink href="/contact">
            Request a survey
          </ButtonLink>
          <ButtonLink href={company.phone.href} variant="outline-light">
            <Icon name="phone" />
            <span className="sr-only">Call </span>
            {company.phone.display}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
