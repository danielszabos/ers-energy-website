import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * The privacy policy and terms: a title band, then numbered sections, with a
 * list of them beside the text on large screens. Section bodies are plain
 * paragraphs and lists, styled by .legal-text in globals.css.
 */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  /** Shown as "Last updated …". */
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader showTitle title={title} intro={intro} />

      <div className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <nav aria-labelledby="legal-contents" className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <div className="sticky top-32">
              <h2
                id="legal-contents"
                className="font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase"
              >
                On this page
              </h2>
              <ol className="mt-5 space-y-1 border-l border-border-grey">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px flex gap-2 rounded-[2px] border-l-2 border-transparent py-1.5 pl-4 text-[0.9375rem] leading-snug text-charcoal transition-colors duration-200 hover:border-deep-green hover:text-deep-base"
                    >
                      <span className="w-5 shrink-0 tabular-nums text-mid-grey">{i + 1}.</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl lg:col-span-8 xl:col-start-5">
            <p className="text-sm text-mid-grey">Last updated {updated}</p>
            {sections.map((section, i) => (
              <section
                key={section.id}
                aria-labelledby={section.id}
                className="mt-10 border-t border-border-grey pt-10 first-of-type:mt-6 first-of-type:border-t-0 first-of-type:pt-0"
              >
                <h2
                  id={section.id}
                  className="flex gap-3 text-xl leading-snug font-bold text-deep-base sm:text-2xl"
                >
                  <span className="tabular-nums text-deep-green">{i + 1}.</span>
                  {section.title}
                </h2>
                <div className="legal-text mt-4 text-charcoal sm:text-[1.0625rem]">{section.body}</div>
              </section>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

/**
 * What the information is used for beside the lawful basis for it: two
 * columns from sm up, stacked (with each basis labelled) on phones.
 */
export function PurposeList({ items }: { items: { purpose: string; basis: ReactNode }[] }) {
  return (
    <div className="mt-6 border-b border-border-grey">
      <div
        aria-hidden="true"
        className="hidden gap-6 pb-3 font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase sm:grid sm:grid-cols-2"
      >
        <span>What we use it for</span>
        <span>Lawful basis</span>
      </div>
      <dl>
        {items.map((item) => (
          <div
            key={item.purpose}
            className="grid gap-1.5 border-t border-border-grey py-4 sm:grid-cols-2 sm:gap-6"
          >
            <dt className="font-semibold text-deep-base">{item.purpose}</dt>
            <dd>
              <span className="mb-0.5 block font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase sm:sr-only">
                Lawful basis
              </span>
              {item.basis}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
