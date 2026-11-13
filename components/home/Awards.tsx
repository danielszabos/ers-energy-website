import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { awards } from "@/lib/site";

// Lime and the light greens are for dark backgrounds only; on white the accents
// switch to deep green.
const tones = {
  dark: {
    card: "border-white/15 bg-white/[0.025]",
    icon: "text-lime",
    result: "",
    category: "text-white/75",
    year: "text-light-green",
  },
  light: {
    card: "border-border-grey bg-white",
    icon: "text-deep-green",
    result: "text-deep-base",
    category: "text-charcoal",
    year: "text-deep-green",
  },
};

/** The award cards: on the homepage (dark) and the About page (light). */
export function AwardCards({
  tone = "dark",
  className,
}: {
  tone?: keyof typeof tones;
  className?: string;
}) {
  const t = tones[tone];

  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5", className)}>
      {awards.map((award, i) => (
        <li key={`${award.category}-${award.year}`} className="min-w-0">
          <Reveal delay={i * 110} className="h-full">
            <div className={cn("flex h-full flex-col border p-4 sm:p-7", t.card)}>
              <Icon name={award.icon} className={cn("size-7 sm:size-8", t.icon)} />
              <p
                className={cn(
                  "mt-8 font-heading text-[clamp(1.125rem,5.2vw,1.5rem)] leading-tight font-bold hyphens-auto sm:text-3xl",
                  t.result,
                )}
              >
                {award.result}
              </p>
              <p className={cn("mt-3 text-sm leading-relaxed sm:text-base", t.category)}>
                {award.category}
              </p>
              <p
                className={cn(
                  "mt-auto pt-6 font-heading text-sm font-semibold tracking-[0.12em]",
                  t.year,
                )}
              >
                {award.year}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function Awards() {
  return (
    <section
      aria-labelledby="awards-heading"
      className="on-dark bg-deep-base py-20 text-white sm:py-24 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-2xl">
          <SectionHeading id="awards-heading">
            <span className="whitespace-nowrap">Award-winning</span> work
          </SectionHeading>
          <p className="mt-5 text-lg text-white/75">
            Recognised at the North West Energy Efficiency Regional Awards.
          </p>
        </Reveal>

        <AwardCards className="mt-12 lg:mt-16" />
      </Container>
    </section>
  );
}
