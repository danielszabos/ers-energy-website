import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { versionedPublicFile } from "@/lib/assets";
import { featuredProjects } from "@/lib/site";
import { ProjectPanels } from "./ProjectPanels";

export function FeaturedProjects() {
  // File checks run on the server; the panels only need the result.
  const projects = featuredProjects.map((project) => ({
    ...project,
    image: versionedPublicFile(project.image),
  }));

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="bg-white pt-20 pb-16 sm:pt-24 lg:pt-32 lg:pb-20"
    >
      <Container>
        <Reveal>
          <SectionHeading id="featured-projects-heading" className="text-deep-base">
            Build on a roof that lasts
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal">
            A selection of roofing and solar projects we&apos;ve delivered for UK businesses.
          </p>
        </Reveal>
      </Container>

      {/* Full width, edge to edge. */}
      <Reveal className="mt-12 lg:mt-16">
        <ProjectPanels projects={projects} />
      </Reveal>

      <Container>
        <Reveal className="mt-10 flex justify-center lg:mt-12">
          <ButtonLink href="/gallery">View all projects</ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
