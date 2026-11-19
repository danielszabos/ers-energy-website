import type { Metadata } from "next";
import { LegalPage, PurposeList, type LegalSection } from "@/components/legal/LegalPage";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ERS Energy collects, uses and looks after your personal information, and the rights you have over it.",
};

// Change this date whenever the policy changes.
const UPDATED = "19 November 2026";

// Written from how the site works (the survey form's fields, no cookies or
// analytics, Vercel hosting, Microsoft 365 email) and what ERS told us. The
// retention periods, "no marketing" and the sharing for projects (network
// operator, MCS) are commitments: ERS must keep to them, and this page must
// change if they do something different. If the survey form starts sending
// through another service (an email API or a CRM), add it under "Who we share
// it with".

const email = (
  <a href={company.email.href}>{company.email.display}</a>
);

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This policy explains how {company.name} (&ldquo;ERS&rdquo;, &ldquo;we&rdquo; or
          &ldquo;us&rdquo;) collects, uses and protects personal information when you use our
          website, get in touch with us or become a customer. We&apos;re the controller of that
          information, which means we decide how it&apos;s used and we&apos;re responsible for
          looking after it.
        </p>
        <p>
          {company.name} is a company registered in {company.registeredIn} (company number{" "}
          {company.companyNumber}). Our registered office is{" "}
          {company.registeredOffice.join(", ")}, and we work from {company.address.join(", ")}.
        </p>
        <p>
          If you have a question about this policy or your information, email us at {email} or
          call us on <a href={company.phone.href}>{company.phone.display}</a>.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "The information we collect",
    body: (
      <>
        <p>
          <strong>When you request a survey.</strong> The survey form on our contact page asks
          for:
        </p>
        <ul>
          <li>your name and the name of your business</li>
          <li>your email address and phone number</li>
          <li>the postcode of the building the work is for</li>
          <li>the service you need and the type of property</li>
        </ul>
        <p>
          <strong>When you call or email us.</strong> Your name, your contact details and anything
          you tell us about your enquiry.
        </p>
        <p>
          <strong>If you become a customer.</strong> The details we need to quote for, carry out
          and support the work. This can include the site address and access arrangements, survey
          notes, photos and drone images of the building, information about the building&apos;s
          energy use (such as bills or meter details), and records of quotes, contracts, invoices
          and payments.
        </p>
        <p>
          <strong>When you visit our website.</strong> Like any website, the servers that host
          ours automatically record some technical information about each visit, such as your IP
          address, the type of browser you use and the pages you request. This is used only to
          keep the site running and secure.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <p>
          We only use your information for the reasons below. The law requires us to have a
          lawful basis for each one, which is shown alongside it.
        </p>
        <PurposeList
          items={[
            {
              purpose: "Replying to your enquiry, arranging your survey and preparing a quote",
              basis: (
                <>
                  Legitimate interests: responding to people who ask about our services. If
                  you&apos;re enquiring for yourself rather than for a business, it&apos;s taking
                  the steps you&apos;ve asked for before entering into a contract.
                </>
              ),
            },
            {
              purpose: "Carrying out the work, including aftercare, warranties and certification",
              basis: (
                <>
                  Contract: carrying out our contract with you. Where the contract is with your
                  business, legitimate interests: delivering the work it has asked for.
                </>
              ),
            },
            {
              purpose: "Keeping accounts, tax and business records",
              basis: "Legal obligation: the records the law requires a business to keep.",
            },
            {
              purpose: "Running our website and keeping it secure",
              basis: "Legitimate interests: keeping the site working and protecting it from misuse.",
            },
            {
              purpose: "Dealing with complaints and legal claims",
              basis: "Legitimate interests: resolving disputes and protecting our business.",
            },
          ]}
        />
        <p>
          We don&apos;t use your information for marketing, we never sell it, and we don&apos;t
          make decisions about you by automated means.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We don&apos;t pass your information to anyone to use for their own purposes. We only
          share it in these cases:
        </p>
        <ul>
          <li>
            <strong>Service providers</strong> that handle it for us, and only on our
            instructions: Microsoft, which provides our email (Microsoft 365), and Vercel, which
            hosts our website.
          </li>
          <li>
            <strong>Organisations your project needs</strong>, if you go ahead with work. For
            example, a solar installation may need an application to the local electricity network
            operator to connect it to the grid, and registration with MCS, the certification
            scheme for solar installations.
          </li>
          <li>
            <strong>Where the law requires it</strong>, for example to HMRC, the police or a
            court.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "Information sent outside the UK",
    body: (
      <p>
        Vercel is based in the United States, and Microsoft may handle information outside the
        UK. When information leaves the UK, it&apos;s protected in the ways UK data protection law
        requires, such as the UK&ndash;US &ldquo;data bridge&rdquo; or contract terms approved by
        the Information Commissioner&apos;s Office (ICO).
      </p>
    ),
  },
  {
    id: "how-long",
    title: "How long we keep it",
    body: (
      <ul>
        <li>
          <strong>Enquiries that don&apos;t go ahead:</strong> two years from when we were last
          in touch, in case you come back to us about the same building. After that, we delete
          them.
        </li>
        <li>
          <strong>Customer records:</strong> six years after the work is finished, which is how
          long we need them for tax purposes and in case of a legal claim. If the work comes with
          a warranty, guarantee or certification that lasts longer, we keep the records needed to
          support it for as long as it lasts.
        </li>
        <li>
          <strong>Website logs:</strong> kept by our hosting provider for a short time, then
          deleted automatically.
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: (
      <p>
        Only the people at ERS who need your information to do their job can see it, and the
        service providers we use are required to keep it secure. Our website and email use
        encrypted connections.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>ask for a copy of the information we hold about you</li>
          <li>ask us to correct anything that&apos;s wrong or incomplete</li>
          <li>ask us to delete your information</li>
          <li>ask us to limit how we use it</li>
          <li>object to us using it, where we rely on legitimate interests</li>
          <li>ask us to send it to you, or to another organisation, in a common format</li>
        </ul>
        <p>
          Some of these rights only apply in certain situations. For example, we may need to keep
          records for tax purposes even if you ask us to delete them. To use any of your rights,
          email {email}. It&apos;s free, and we&apos;ll reply within one month.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        Our website doesn&apos;t use cookies or any similar technology. There are no analytics,
        advertising or social media trackers, and our fonts are hosted on our own site, so
        visiting it doesn&apos;t share anything about you with other companies, apart from the
        hosting logs described above.
      </p>
    ),
  },
  {
    id: "complaints",
    title: "Complaints",
    body: (
      <p>
        If you&apos;re unhappy with how we&apos;ve handled your information, please tell us first
        and we&apos;ll do our best to put it right. You can also complain to the ICO, the UK&apos;s
        data protection regulator, at{" "}
        <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a> or on{" "}
        <a href="tel:+443031231113">0303 123 1113</a>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We&apos;ll update this policy if the way we use personal information changes. The date at
        the top shows when it was last updated.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How ERS Energy collects, uses and looks after your personal information."
      updated={UPDATED}
      sections={sections}
    />
  );
}
