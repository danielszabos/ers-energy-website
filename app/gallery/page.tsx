import type { Metadata } from "next";
import { GalleryProjectSection } from "@/components/gallery/GalleryProjectSection";
import { ProjectExplorer } from "@/components/gallery/ProjectExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { TalkToTeam } from "@/components/layout/TalkToTeam";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryCategories, galleryProjects } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Roofing, solar PV and battery storage projects delivered by ERS Energy across the UK.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero id="gallery-heading" image="/projects/heroimage.jpg" title="Our work">
        A selection of roofing, solar and battery storage projects ERS has delivered nationwide.
        Select a project to see the full story and more photos.
      </PageHero>

      {/* No bottom padding: the section after it brings its own space. */}
      <section aria-label="Projects" className="bg-white pt-16 sm:pt-20 lg:pt-24">
        {/* What the projects below have in common. Kept general (no project
            names or figures), so it stays true as projects come and go. */}
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase">
              Our projects
            </p>
            <SectionHeading id="projects-intro-heading" size="compact" className="mt-3 text-deep-base">
              Built from the roof up
            </SectionHeading>
          </Reveal>
          <Reveal
            delay={120}
            className="space-y-5 leading-relaxed text-charcoal sm:text-lg sm:leading-relaxed lg:col-span-7"
          >
            <p>
              Every project here starts with the roof. Solar panels are built to last for decades,
              so before any go on, we make sure the roof beneath them will too. Sometimes that means
              a new roof first; where a roof is already in good shape, the panels go straight on.
              And where it makes sense, battery storage goes in alongside, so more of what the
              panels generate is used on site.
            </p>
            <p>
              The buildings vary as much as the work, from sports grounds and transport hubs to
              factories, offices, farms and public buildings. Each one has its own access, safety
              and timing to plan around, and we work around the people who use it, so businesses
              can keep running while the job gets done.
            </p>
            <p>
              Choose a type of work below to see just those projects, or open any of them for the
              full story and more photos.
            </p>
          </Reveal>
        </Container>

        <div className="mt-12 lg:mt-16">
          <ProjectExplorer
            categories={galleryCategories}
            projects={galleryProjects.map((project) => ({
              id: project.id,
              categories: project.categories,
              strip: <GalleryProjectSection project={project} />,
            }))}
          />
        </div>
      </section>

      <TalkToTeam />
    </>
  );
}
