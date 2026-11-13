import { AccreditationLogo } from "@/components/brand/AccreditationLogo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {items.map((item, i) => (
            <li key={item.slug}>
              <Reveal delay={(i % 3) * 90} className="h-full">
                <div className="flex h-full flex-col border border-border-grey bg-white p-6 sm:p-7">
                  {/* A fixed-height row, so the names line up whatever the logo's shape. */}
                  <div className="flex h-16 items-center">
                    <AccreditationLogo
                      slug={item.slug}
                      name={item.name}
                      scale={item.scale}
                      decorative
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-deep-base">{item.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
