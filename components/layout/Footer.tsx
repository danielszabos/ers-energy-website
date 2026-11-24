import Link from "next/link";
import type { CSSProperties } from "react";
import { AccreditationLogo } from "@/components/brand/AccreditationLogo";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Icon } from "@/components/ui/Icon";
import { accreditations, company, legalLinks, navLinks } from "@/lib/site";

const headingClass =
  "font-heading text-xs font-semibold tracking-[0.16em] text-white/60 uppercase";

/**
 * Three bands: the logo, page links and contact details; the accreditation
 * logos in one even row (two rows of five on phones); then the copyright,
 * legal links and the company details the law requires, in small print.
 */
export function Footer() {
  return (
    <footer
      id="site-footer"
      className="on-dark border-t border-white/10 bg-deep-base text-white/75"
    >
      <Container className="grid gap-10 py-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-5">
          <Link
            href="/"
            aria-label={`${company.shortName} home`}
            className="inline-block rounded-[2px]"
          >
            <Logo className="h-14 lg:h-16" />
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed">
            Commercial roofing and solar PV for businesses across the UK.
          </p>
        </div>

        <nav aria-labelledby="footer-pages" className="lg:col-span-3">
          <h2 id="footer-pages" className={headingClass}>
            Pages
          </h2>
          {/* Two short columns on phones; one list from sm up. */}
          <ul className="mt-5 grid grid-flow-col grid-rows-3 gap-x-6 gap-y-3 sm:grid-flow-row sm:grid-rows-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-[2px] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className={headingClass}>Contact</h2>
          <address className="mt-5 space-y-3.5 not-italic">
            <a
              href={company.phone.href}
              className="flex w-fit items-center gap-3 rounded-[2px] font-heading text-lg font-semibold text-white transition-colors hover:text-light-green"
            >
              <Icon name="phone" className="size-5 shrink-0 text-brand-green" />
              {company.phone.display}
            </a>
            <a
              href={company.email.href}
              className="flex w-fit items-center gap-3 rounded-[2px] transition-colors hover:text-white"
            >
              <Icon name="mail" className="size-5 shrink-0 text-brand-green" />
              {company.email.display}
            </a>
            <p className="flex gap-3 leading-relaxed">
              <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-brand-green" />
              {company.address.join(", ")}
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-5 py-8 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <h2 id="footer-accreditations" className={headingClass}>
            Accredited and approved
          </h2>
          {/* Two even rows on phones, one row from md up, however many logos
              there are. */}
          <ul
            aria-labelledby="footer-accreditations"
            className="grid grid-cols-[repeat(var(--half),minmax(0,1fr))] gap-2 md:grid-cols-[repeat(var(--all),minmax(0,1fr))] xl:grid-cols-[repeat(var(--all),4.5rem)]"
            style={
              {
                "--all": accreditations.length,
                "--half": Math.ceil(accreditations.length / 2),
              } as CSSProperties
            }
          >
            {accreditations.map((item) => (
              <li key={item.slug}>
                <AccreditationLogo
                  slug={item.slug}
                  name={item.name}
                  scale={item.scale}
                  tone="dark"
                />
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="py-6 text-sm text-white/60">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p>
              © <CurrentYear fallback={2026} /> {company.name}
            </p>
            <ul className="flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-[2px] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Required on the website of a limited, VAT-registered company. */}
          <ul className="mt-4 flex flex-col gap-1 text-xs leading-relaxed text-white/55 lg:flex-row lg:gap-0 lg:[&>li+li]:ml-4 lg:[&>li+li]:border-l lg:[&>li+li]:border-white/15 lg:[&>li+li]:pl-4">
            <li>
              Registered in {company.registeredIn}, company no. {company.companyNumber}
            </li>
            <li>VAT no. {company.vatNumber}</li>
            <li>Registered office: {company.registeredOffice.join(", ")}</li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
