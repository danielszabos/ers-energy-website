import type { Metadata } from "next";
import { SurveyQuestionnaire } from "@/components/contact/SurveyQuestionnaire";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a survey of your commercial roof or solar project, or call the ERS Energy team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" />

      <section className="bg-off-white py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SurveyQuestionnaire />
          </div>

          <aside aria-labelledby="contact-direct-heading" className="lg:col-span-5 lg:pt-10">
            <h2 id="contact-direct-heading" className="text-2xl font-bold text-deep-base">
              Prefer to talk?
            </h2>
            <p className="mt-3 leading-relaxed text-charcoal">
              Give the team a call and we can talk the job through with you.
            </p>
            <ButtonLink href={company.phone.href} variant="outline-dark" className="mt-6">
              <Icon name="phone" />
              <span className="sr-only">Call </span>
              {company.phone.display}
            </ButtonLink>

            <div className="mt-10 border-t border-border-grey pt-8">
              <h2 className="font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase">
                Our office
              </h2>
              <address className="mt-3 leading-relaxed text-charcoal not-italic">
                {company.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
