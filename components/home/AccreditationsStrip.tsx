import { AccreditationLogo } from "@/components/brand/AccreditationLogo";
import { accreditations } from "@/lib/site";
import { AccreditationsMarquee } from "./AccreditationsMarquee";

export function AccreditationsStrip() {
  return (
    <section
      aria-labelledby="accreditations-heading"
      className="border-b border-border-grey bg-white py-10 sm:py-12"
    >
      <AccreditationsMarquee
        heading={
          <h2
            id="accreditations-heading"
            className="font-heading text-sm font-semibold tracking-[0.14em] text-charcoal uppercase"
          >
            Accredited and approved
          </h2>
        }
      >
        {accreditations.map((item) => (
          <li key={item.slug} className="flex shrink-0 items-center">
            <AccreditationLogo slug={item.slug} name={item.name} scale={item.scale} />
          </li>
        ))}
      </AccreditationsMarquee>
    </section>
  );
}
