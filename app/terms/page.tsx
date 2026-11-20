import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the ERS Energy website.",
};

// Change this date whenever the terms change.
const UPDATED = "19 November 2026";

// Website terms of use only. ERS's terms for roofing and solar work come with
// each quotation; "Quotes and our work" says those take priority.

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply when you use the {company.shortName} website. By using the site, you
          accept them. If you don&apos;t agree with them, please don&apos;t use the site.
        </p>
        <p>
          The website is run by {company.name}, a company registered in {company.registeredIn}{" "}
          (company number {company.companyNumber}). Our registered office is{" "}
          {company.registeredOffice.join(", ")}, and our VAT number is {company.vatNumber}.
        </p>
      </>
    ),
  },
  {
    id: "using-our-site",
    title: "Using our website",
    body: (
      <>
        <p>
          Our website is free to use, and you don&apos;t need an account. We may change, suspend
          or withdraw any part of it at any time, and we can&apos;t promise it will always be
          available.
        </p>
        <p>
          You must not misuse the site. That includes trying to get unauthorised access to it or
          the systems behind it, introducing viruses or other harmful material, attacking it (for
          example, with a denial-of-service attack), or using automated tools to copy its content.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "The information on our site",
    body: (
      <>
        <p>
          The content on our website is general information about our services. It isn&apos;t
          advice about your building, so please don&apos;t rely on it as advice. We&apos;ll only
          recommend work once we&apos;ve surveyed the building.
        </p>
        <p>
          Figures shown for our projects, such as system sizes, savings and carbon reductions,
          relate to those projects only. What a system achieves depends on the building, the
          system and how energy is used there, so we can&apos;t promise the same results for yours.
        </p>
        <p>
          Testimonials describe individual customers&apos; experiences. We may shorten them and
          remove personal details.
        </p>
        <p>
          We work to keep the site accurate and up to date, but we can&apos;t guarantee that
          everything on it is complete or current.
        </p>
      </>
    ),
  },
  {
    id: "quotes",
    title: "Quotes and our work",
    body: (
      <>
        <p>
          Nothing on our website is an offer to carry out work at a particular price. Requesting a
          survey doesn&apos;t commit you, or us, to anything.
        </p>
        <p>
          Any work we carry out is covered by the written quotation and terms and conditions we
          give you before it starts. If anything in these website terms conflicts with them, they
          take priority.
        </p>
      </>
    ),
  },
  {
    id: "our-content",
    title: "Our content",
    body: (
      <>
        <p>
          We own, or have permission to use, everything on our website, including its text,
          photos, video, logo and design. You may view it, and print or download pages for your
          own reference, for example to share with colleagues when planning a project. You must
          not copy or reuse any of it for commercial purposes without our written permission.
        </p>
        <p>
          The accreditation and award logos on our site belong to the organisations that issue
          them.
        </p>
      </>
    ),
  },
  {
    id: "other-websites",
    title: "Other websites",
    body: (
      <p>
        Where our site links to other websites, the links are there for your information only. We
        don&apos;t control those sites and aren&apos;t responsible for them.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: (
      <>
        <p>
          Nothing in these terms limits or excludes our liability for death or personal injury
          caused by our negligence, for fraud or fraudulent misrepresentation, or for anything
          else that can&apos;t be limited or excluded under English law.
        </p>
        <p>
          <strong>If you use our site for business.</strong> We provide the site free of charge
          and as it is. As far as the law allows, we aren&apos;t liable for any loss or damage
          arising from using, or being unable to use, the site, or from relying on its content. In
          particular, we aren&apos;t liable for loss of profits, sales, business or revenue,
          business interruption, loss of anticipated savings, loss of business opportunity,
          goodwill or reputation, or any indirect or consequential loss.
        </p>
        <p>
          <strong>If you&apos;re a consumer.</strong> We&apos;re responsible for loss or damage
          you suffer that&apos;s a foreseeable result of us breaking these terms or failing to use
          reasonable care and skill. We aren&apos;t responsible for loss or damage that isn&apos;t
          foreseeable.
        </p>
        <p>
          As long as we&apos;ve taken reasonable care, we aren&apos;t liable for loss or damage
          caused by a virus or other harmful material that affects your device, software or data
          because you used our site.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Your personal information",
    body: (
      <p>
        Our <Link href="/privacy-policy">privacy policy</Link> explains how we use any personal
        information you give us, including through the survey form.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The version on this page when you use the
        site is the one that applies, and the date at the top shows when it was last changed.
      </p>
    ),
  },
  {
    id: "law",
    title: "Law and disputes",
    body: (
      <p>
        These terms are governed by the law of England and Wales, and any dispute about them will
        be dealt with by the courts of England and Wales. If you&apos;re a consumer living in
        Scotland or Northern Ireland, you can also bring proceedings in your local courts.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        If you have a question about these terms, email us at{" "}
        <a href={company.legalEmail.href}>{company.legalEmail.display}</a> or call us on{" "}
        <a href={company.phone.href}>{company.phone.display}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms that apply when you use the ERS Energy website."
      updated={UPDATED}
      sections={sections}
    />
  );
}
