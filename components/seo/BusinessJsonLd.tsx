import { company } from "@/lib/site";
import { siteUrl } from "@/lib/siteUrl";

// The company's details in a form search engines read (schema.org), so they can
// show the name, phone number and address alongside search results. On the
// homepage only. Uses the same details as the footer, from lib/site.
export function BusinessJsonLd() {
  const [building, street, town, postcode] = company.address;
  const data = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: company.name,
    alternateName: company.shortName,
    url: siteUrl.href,
    logo: new URL("/logo/ers-logo.svg", siteUrl).href,
    image: new URL("/opengraph-image.jpg", siteUrl).href,
    telephone: company.phone.href.replace("tel:", ""),
    email: company.email.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${building}, ${street}`,
      addressLocality: town,
      addressRegion: "Greater Manchester",
      postalCode: postcode,
      addressCountry: "GB",
    },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    vatID: company.vatNumber.replace(/\s/g, ""),
  };

  return (
    <script
      type="application/ld+json"
      // Escaped so nothing in the data can close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
