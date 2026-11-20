import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectMap, type MapPlace } from "./ProjectMap";
import { projectPlaces } from "./projectPlaces";
import { toMapPercent, ukMap } from "./ukMapData";

const { width, height } = ukMap.viewBox;

// Rounded, so the server and browser write identical inline styles.
const round = (n: number) => Math.round(n * 100) / 100;

const places: MapPlace[] = projectPlaces.map(({ lat, lon, projects, ...place }) => {
  const { left, top } = toMapPercent(lat, lon);
  return { ...place, left: round(left), top: round(top), count: projects.length };
});

export function WhereErsWorks() {
  return (
    <section
      aria-labelledby="where-heading"
      className="on-dark bg-deep-base py-20 text-white sm:py-24 lg:py-32"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <SectionHeading id="where-heading">
            Based in Greater Manchester, working nationwide
          </SectionHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            From our home in Greater Manchester, ERS works on commercial and industrial buildings
            across the UK. The map shows more than 100 sites we&apos;ve worked on over the past
            decade.
          </p>
          <ul aria-label="Map key" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="size-3.5 rounded-full bg-lime" />
              Our HQ
            </li>
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="size-3.5 rounded-full bg-white" />
              Places we&apos;ve worked
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5">
          <div className="mx-auto w-full max-w-[21rem] lg:max-w-[23rem]">
            <ProjectMap
              places={places}
              aspectRatio={width / height}
              // Starts a little zoomed in, so the big group around Greater
              // Manchester has begun to split (about 75 to 80 projects in it),
              // with the bottom of the map in view: all of England and Wales,
              // Northern Ireland and most of Scotland.
              start={{ k: 1.3, left: 48.8, top: 61.5 }}
            >
              <svg
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden="true"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d={ukMap.uk}
                  strokeLinejoin="round"
                  className="project-map-outline fill-white/[0.08] stroke-white/25"
                />
              </svg>
            </ProjectMap>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
