"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { company, navLinks } from "@/lib/site";

const SOLID_AFTER_PX = 80;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function useScrolledPast(px: number) {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > px,
    () => false,
  );
}

export function Nav({ logo }: { logo: ReactNode }) {
  const pathname = usePathname();
  // Pages with a photo hero keep the bar clear over it. Other inner pages only
  // have a nav-high dark band behind the bar (PageHeader), so there the bar
  // turns solid as soon as the page moves.
  const hasHero = pathname === "/" || pathname === "/about";
  const scrolled = useScrolledPast(hasHero ? SOLID_AFTER_PX : 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // While the full-screen menu is open: lock scrolling, take the page out of
  // the tab order, move focus into the menu and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const background = [
      document.getElementById("main-content"),
      document.getElementById("site-footer"),
    ];
    root.dataset.menuOpen = "";
    background.forEach((el) => el?.setAttribute("inert", ""));
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const close = () => setMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", close);
    return () => {
      delete root.dataset.menuOpen;
      background.forEach((el) => el?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", close);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const closeMenu = () => setMenuOpen(false);
  // Light bar with dark text once the page scrolls or the pointer is over it.
  // The open mobile menu keeps it clear so it blends into the dark overlay.
  const solid = (scrolled || hovered) && !menuOpen;

  return (
    <header>
      <div
        data-solid={solid || undefined}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color,backdrop-filter] duration-300 ease-out",
          solid
            ? "border-border-grey bg-white/95 text-deep-base backdrop-blur-md"
            : "on-dark border-transparent text-white",
        )}
      >
        {/* On large screens the bar and logo ease down a size once the page scrolls. */}
        <Container
          className={cn(
            "flex h-20 items-center justify-between gap-6 transition-[height] duration-300 ease-out",
            scrolled ? "lg:h-24" : "lg:h-28",
          )}
        >
          <Link
            href="/"
            aria-label={`${company.shortName} home`}
            onClick={closeMenu}
            className="-m-1 flex shrink-0 items-center rounded-[2px] p-1"
          >
            {/* Over the video, a soft halo keeps the fine "ENERGY LTD" lettering legible. */}
            <span
              className={cn(
                "block h-[3.75rem] transition-[height,filter] duration-300 ease-out",
                scrolled ? "lg:h-[4.25rem]" : "lg:h-[5.25rem]",
                !solid && !menuOpen && "drop-shadow-md drop-shadow-deep-base/60",
              )}
            >
              {logo}
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className="relative block rounded-[2px] px-3.5 py-2 text-base font-medium after:absolute after:inset-x-3.5 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-green after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 lg:ml-4">
            {/* Kept in the bar on phones too, except the very narrowest, and
                hidden while the menu (which repeats it) is open. */}
            <div className={cn("max-[24rem]:hidden", menuOpen && "invisible")}>
              {/* White over the hero; green once the bar turns white. */}
              <ButtonLink
                href="/contact"
                variant={solid ? "primary" : "light"}
                size="sm"
                className="lg:min-h-12 lg:px-6 lg:text-[0.9375rem]"
              >
                Get in touch
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="-mr-2 flex size-12 items-center justify-center rounded-[2px] lg:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <Icon name={menuOpen ? "close" : "menu"} className="size-7" />
            </button>
          </div>
        </Container>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={cn(
          "on-dark fixed inset-0 z-40 overflow-y-auto bg-deep-base text-white transition-[opacity,visibility] duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Container className="flex min-h-full flex-col pt-28 pb-10">
          <nav aria-label="Main">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    onClick={closeMenu}
                    className="block py-4 font-heading text-2xl font-semibold aria-[current=page]:text-light-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 flex flex-col gap-3">
            <ButtonLink href="/contact" variant="light" onClick={closeMenu}>
              Get in touch
            </ButtonLink>
            <ButtonLink href={company.phone.href} variant="outline-light">
              <Icon name="phone" />
              Call {company.phone.display}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
