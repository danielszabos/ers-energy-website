import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps: { title: string; text: string; icon: IconName }[] = [
  { title: "Survey", text: "Drone imagery and an on-site inspection of the roof.", icon: "drone" },
  {
    title: "Prepare",
    text: "Repairs, corrosion treatment or a full refurbishment where needed.",
    icon: "wrench",
  },
  { title: "Install", text: "Solar PV and battery storage, fitted by the same team.", icon: "solar" },
  {
    title: "Support",
    text: "Performance monitoring and planned maintenance after handover.",
    icon: "chart",
  },
];

/**
 * Four steps in a row on large screens, stacked on smaller ones. A faint line
 * joins the steps and a green one draws along it, one stretch at a time, when
 * the list scrolls into view (see .process-line in globals.css).
 */
export function HowErsWorks() {
  return (
    <section
      aria-labelledby="process-heading"
      className="on-dark bg-deep-base py-20 text-white sm:py-24 lg:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeading id="process-heading">How ERS works</SectionHeading>
        </Reveal>

        <Reveal className="mt-12 lg:mt-16">
          <ol className="grid max-w-xl gap-10 lg:max-w-none lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
                {/* The stretch to the next step: down on small screens, across on large. */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-13 -bottom-9 left-6 w-px bg-white/10 lg:top-6 lg:-right-7 lg:bottom-auto lg:left-13 lg:h-px lg:w-auto"
                  >
                    <span
                      className="process-line block size-full bg-brand-green"
                      style={{ "--line-delay": `${400 + i * 450}ms` } as CSSProperties}
                    />
                  </span>
                )}
                <span className="flex size-12 shrink-0 items-center justify-center border border-white/15 bg-white/[0.025] text-light-green">
                  <Icon name={step.icon} className="size-6" />
                </span>
                <div className="pt-1 lg:pt-0">
                  <p className="font-heading text-sm font-semibold tracking-[0.2em] text-brand-green lg:mt-7">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
