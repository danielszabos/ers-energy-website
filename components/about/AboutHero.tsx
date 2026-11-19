import { PageHero } from "@/components/layout/PageHero";

export function AboutHero() {
  return (
    <PageHero
      id="about-hero-heading"
      image="/about/hero.jpg"
      // Portrait photo in a wide band: keep the roofers (upper middle) in frame.
      position="50% 22%"
      title="Why one contractor?"
    >
      The story behind ERS Energy and the approach that sets it apart.
    </PageHero>
  );
}
