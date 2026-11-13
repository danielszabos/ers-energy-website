import type { Metadata } from "next";
import { AboutAccreditations } from "@/components/about/AboutAccreditations";
import { AboutAwards } from "@/components/about/AboutAwards";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTestimonial } from "@/components/about/AboutTestimonial";
import { HowErsWorks } from "@/components/about/HowErsWorks";
import { MayorVisit } from "@/components/about/MayorVisit";
import { Story } from "@/components/about/Story";
import { TalkToTeam } from "@/components/about/TalkToTeam";
import { WhereErsWorks } from "@/components/about/WhereErsWorks";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind ERS Energy and the approach that sets it apart.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <MayorVisit />
      <HowErsWorks />
      <AboutAccreditations />
      <AboutAwards />
      <AboutTestimonial />
      <WhereErsWorks />
      <TalkToTeam />
    </>
  );
}
