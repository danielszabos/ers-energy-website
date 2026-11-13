import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  // Green buttons always carry deep-base text.
  primary: "bg-brand-green text-deep-base hover:bg-light-green",
  // White, turning green on hover: over the hero video and in the nav.
  light: "bg-white text-deep-base hover:bg-brand-green",
  // Frosted glass with a thin white outline, turning green on hover: over imagery.
  glass:
    "border border-white/80 bg-white/10 text-white backdrop-blur-md hover:border-brand-green hover:bg-brand-green hover:text-deep-base",
  "outline-light":
    "border border-white/70 text-white hover:border-white hover:bg-white hover:text-deep-base",
  "outline-dark":
    "border border-deep-base text-deep-base hover:bg-deep-base hover:text-white",
};

const sizes = {
  md: "min-h-12 px-6 py-3 text-[0.9375rem]",
  sm: "min-h-10 px-4 py-2 text-sm",
};

type ButtonStyle = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

/** The button look, for real <button>s that should match ButtonLink. */
export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyle = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2.5 rounded-full font-heading font-semibold whitespace-nowrap transition-colors duration-200 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonLinkProps = Omit<ComponentProps<"a">, "href"> & ButtonStyle & { href: string };

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
