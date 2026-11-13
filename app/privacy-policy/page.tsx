import type { Metadata } from "next";
import { PageHeader, PlaceholderBody } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <PlaceholderBody>[Privacy policy to follow]</PlaceholderBody>
    </>
  );
}
