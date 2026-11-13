import type { Metadata } from "next";
import { PageHeader, PlaceholderBody } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms" />
      <PlaceholderBody>[Terms and conditions to follow]</PlaceholderBody>
    </>
  );
}
