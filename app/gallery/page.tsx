import type { Metadata } from "next";
import { GalleryProjectSection } from "@/components/gallery/GalleryProjectSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryProjects } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Roofing, solar PV and battery storage projects delivered by ERS Energy across the UK.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Gallery" />

      <section aria-labelledby="gallery-heading" className="bg-white pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionHeading id="gallery-heading" className="text-deep-base">
              Our work
            </SectionHeading>
            <p className="mt-5 text-lg leading-relaxed text-charcoal">
              A selection of roofing, solar and battery storage projects ERS has delivered, from a
              house in Bolton to the Alan Kelly Stand at Preston North End. Select a project to see
              the full story and more photos.
            </p>
          </Reveal>
        </Container>

        {/* Full width, edge to edge, like the homepage project panels. */}
        <Reveal className="mt-12 lg:mt-16">
          <div className="project-strips">
            {galleryProjects.map((project) => (
              <GalleryProjectSection key={project.id} project={project} />
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
