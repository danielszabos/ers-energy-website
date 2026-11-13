import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/lib/site";

export function TalkToTeam() {
  return (
    <section aria-labelledby="talk-heading" className="bg-white py-20 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <SectionHeading id="talk-heading" className="text-deep-base">
            Talk to the team
          </SectionHeading>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact">Request a survey</ButtonLink>
          <ButtonLink href={company.phone.href} variant="outline-dark">
            <Icon name="phone" />
            <span className="sr-only">Call </span>
            {company.phone.display}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
