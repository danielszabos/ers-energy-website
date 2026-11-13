import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BuildingIllustration } from "./BuildingIllustration";
import { RoofToSolarScene } from "./RoofToSolarScene";

const steps = ["Survey and refurbish", "Install solar PV", "Store and use your own energy"];

/**
 * Signature section. On large screens the illustration sticks in the right
 * column while the intro and step captions scroll past on the left; on smaller
 * screens it sticks under the nav with the captions scrolling beneath it.
 */
export function RoofToSolar() {
  return (
    <section
      id="roof-to-solar"
      aria-labelledby="roof-to-solar-heading"
      className="on-dark relative bg-deep-base text-white"
    >
      <RoofToSolarScene>
        <Container className="grid lg:grid-cols-12 lg:gap-x-12">
          <Reveal className="pt-20 sm:pt-24 lg:col-span-5 lg:row-start-1 lg:pt-36">
            <SectionHeading id="roof-to-solar-heading" size="compact">
              Fix the roof.
              <br /> Then <span className="text-lime">make it pay.</span>
            </SectionHeading>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Solar panels are only as good as the roof under them. We assess and
              refurbish the roof first, then design and install a solar system on a
              structure that will outlast it. One survey, one team, one point of
              contact.
            </p>
          </Reveal>

          <div className="z-10 -mx-4 bg-deep-base px-4 pt-8 pb-5 motion-safe:sticky motion-safe:top-20 sm:-mx-6 sm:px-6 lg:col-span-7 lg:col-start-6 lg:row-span-3 lg:row-start-1 lg:mx-0 lg:flex lg:items-center lg:self-start lg:px-0 lg:pt-24 lg:pb-0 lg:motion-safe:top-0 lg:motion-safe:h-svh">
            <div className="mx-auto w-[min(100%,72svh)] lg:w-full">
              <div className="overflow-hidden rounded-[3px] ring-1 ring-white/10">
                <BuildingIllustration />
              </div>
              <div className="mt-4 h-0.5 bg-white/10 motion-reduce:hidden">
                <div data-scene="progress" className="h-full bg-brand-green" />
              </div>
            </div>
          </div>

          <ol
            data-scene="steps"
            className="pb-20 sm:pb-24 lg:col-span-5 lg:row-start-2 lg:pb-0"
          >
            {steps.map((step, i) => (
              <li
                key={step}
                data-scene="step"
                className="flex items-center border-l border-white/15 py-8 pl-6 motion-safe:min-h-[55svh] lg:motion-safe:min-h-[70svh]"
              >
                <p>
                  <span className="block font-heading text-sm font-semibold tracking-[0.2em] text-brand-green">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 block font-heading text-2xl font-semibold sm:text-3xl">
                    {step}
                  </span>
                </p>
              </li>
            ))}
          </ol>

          {/* On large screens this keeps the illustration pinned until the
              timeline has finished (it ends when the steps reach 55%). It is a
              separate row because padding on the steps would move that end point. */}
          <div
            aria-hidden="true"
            className="hidden lg:col-span-5 lg:row-start-3 lg:block lg:h-36 lg:motion-safe:h-[50svh]"
          />
        </Container>
      </RoofToSolarScene>
    </section>
  );
}
