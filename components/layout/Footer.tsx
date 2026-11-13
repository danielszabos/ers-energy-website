import Link from "next/link";
import { AccreditationLogo } from "@/components/brand/AccreditationLogo";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { accreditations, company, legalLinks, navLinks } from "@/lib/site";

const headingClass =
  "font-heading text-xs font-semibold tracking-[0.16em] text-white/60 uppercase";

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="on-dark border-t border-white/10 bg-deep-base text-white/75"
    >
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Link
            href="/"
            aria-label={`${company.shortName} home`}
            className="inline-block rounded-[2px]"
          >
            <Logo className="h-16 lg:h-[4.5rem]" />
          </Link>
          <address className="mt-8 leading-relaxed not-italic">
            {company.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={company.phone.href}
            className="mt-5 inline-flex items-center gap-2.5 rounded-[2px] font-heading text-lg font-semibold text-white transition-colors hover:text-light-green"
          >
            <Icon name="phone" className="size-5 text-brand-green" />
            {company.phone.display}
          </a>
        </div>

        <nav aria-labelledby="footer-pages" className="lg:col-span-2 lg:col-start-6">
          <h2 id="footer-pages" className={headingClass}>
            Pages
          </h2>
          <ul className="mt-5 space-y-3">
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

        <div className="md:col-span-2 lg:col-span-5 lg:col-start-8">
          <h2 className={headingClass}>Accredited and approved</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
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
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {company.name}. All rights reserved.</p>
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
        </Container>
      </div>
    </footer>
  );
}
