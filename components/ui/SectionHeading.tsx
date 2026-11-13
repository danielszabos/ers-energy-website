import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  default: "text-[2rem] sm:text-4xl lg:text-5xl",
  // For headings sharing a row with other content on large screens.
  compact: "text-[2rem] sm:text-4xl xl:text-[2.75rem]",
};

export function SectionHeading({
  id,
  size = "default",
  className,
  children,
}: {
  id?: string;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "font-heading leading-[1.1] font-bold tracking-[-0.015em]",
        sizes[size],
        className,
      )}
    >
      {children}
    </h2>
  );
}
