import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPins, type MapPin } from "./MapPins";
import { toMapPercent, ukMap } from "./ukMapData";

const locations: (Omit<MapPin, "left" | "top"> & { lat: number; lon: number })[] = [
  { id: "leigh", name: "Leigh", note: "Our base", lat: 53.4975, lon: -2.516, base: true },
  // Only about 13 km from Leigh, so the marker sits a little to the side with a
  // short line back to the real spot; otherwise the two pins would overlap.
  { id: "trafford-park", name: "Trafford Park", lat: 53.468, lon: -2.322, nudge: [26, 16], labelRight: true },
  { id: "west-bromwich", name: "West Bromwich", lat: 52.5187, lon: -1.9945 },
  { id: "wellingborough", name: "Wellingborough", lat: 52.3021, lon: -0.6939 },
];

const pins: MapPin[] = locations.map(({ lat, lon, ...pin }) => ({
  ...pin,
  ...toMapPercent(lat, lon),
}));

export function WhereErsWorks() {
  const { width, height } = ukMap.viewBox;

  return (
    <section
      aria-labelledby="where-heading"
      className="on-dark bg-deep-base py-20 text-white sm:py-24 lg:py-32"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <SectionHeading id="where-heading">Based in Leigh, working nationwide</SectionHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            ERS works on commercial and industrial buildings across the UK from its base at Leigh
            Works, Bradshawgate, Leigh.
          </p>
          <ul aria-label="Map key" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="size-3.5 rounded-full bg-lime" />
              Our base
            </li>
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="mx-0.5 size-2.5 rounded-full bg-white" />
              Recent projects
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5">
          <div
            className="relative mx-auto w-full max-w-[21rem] lg:max-w-[23rem]"
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              aria-hidden="true"
              className="absolute inset-0 size-full"
            >
              <path
                d={ukMap.uk}
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="fill-white/[0.08] stroke-white/25"
              />
            </svg>
            <MapPins pins={pins} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
