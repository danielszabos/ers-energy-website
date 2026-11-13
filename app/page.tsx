import { AboutPreview } from "@/components/home/AboutPreview";
import { AccreditationsStrip } from "@/components/home/AccreditationsStrip";
import { Awards } from "@/components/home/Awards";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AccreditationsStrip />
      <FeaturedProjects />
      <AboutPreview />
      <Services />
      <Awards />
      <Testimonials />
      <FinalCta />
    </>
  );
}
