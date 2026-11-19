import { AccreditationLogo } from "@/components/brand/AccreditationLogo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SwipeRow } from "@/components/ui/SwipeRow";
import { accreditations } from "@/lib/site";

// Shown in this order; names, logos and descriptions come from lib/site.ts.
const order = [
  "mcs",
  "recc",
  "hies",
  "chas",
  "safecontractor",
  "constructionline",
  "institute-of-roofing",
  "corc",
  "napit",
];

const items = order.flatMap((slug) => {
  const item = accreditations.find((a) => a.slug === slug);
  return item?.description ? [{ ...item, description: item.description }] : [];
});

export function AboutAccreditations() {
  return (
    <section aria-labelledby="about-accreditations-heading" className="bg-white py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading id="about-accreditations-heading" className="text-deep-base">
            Accredited and approved
          </SectionHeading>
        </Reveal>

        {/* Phones: one row of cards to swipe through, edge to edge, with the
            next card peeking in. From sm up: a grid. */}
        <div className="mt-10 sm:mt-12 lg:mt-16">
          <SwipeRow
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-5 [&::-webkit-scrollbar]:hidden"
            barClassName="sm:hidden"
          >
            {items.map((item, i) => (
              <li key={item.slug} className="w-[80%] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none">
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <div className="flex h-full flex-col border border-border-grey bg-white p-5 sm:p-7">
                    {/* A fixed-height row, so the names line up whatever the logo's shape. */}
                    <div className="flex h-16 items-center">
                      <AccreditationLogo
                        slug={item.slug}
                        name={item.name}
                        scale={item.scale}
                        decorative
                      />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-deep-base sm:mt-6">{item.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </SwipeRow>
        </div>
      </Container>
    </section>
  );
}
