import { findPublicImage, readPublicSvg } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { company } from "@/lib/site";

const WHITE_TEXT_LOGO = "/logo/ers-logo-white-text";

// The draw-in animates these groups in the SVG file. If a replacement logo
// doesn't have them, it still animates, as a single piece.
const PART_IDS = ["logo-bar-1", "logo-bar-2", "logo-lime", "logo-text"];

/** White-text logo for dark backgrounds. Size it with a height class. */
export function Logo({
  animate = false,
  className,
}: {
  animate?: boolean;
  className?: string;
}) {
  if (!animate) {
    const file = findPublicImage(WHITE_TEXT_LOGO);
    if (!file) return <LogoFallback className={className} />;
    return (
      // A plain <img> keeps the SVG crisp at its natural aspect ratio.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file.src}
        alt=""
        width={file.width}
        height={file.height}
        className={cn("logo w-auto", className)}
      />
    );
  }

  // The animated logo is inlined so CSS can reach the individual shapes.
  const svg = readPublicSvg(`${WHITE_TEXT_LOGO}.svg`);
  if (!svg) return <LogoFallback className={className} />;

  const hasParts = PART_IDS.every((id) => svg.includes(`id="${id}"`));
  return (
    <span
      className={cn("logo inline-block", hasParts ? "logo-draw" : "logo-fade", className)}
      dangerouslySetInnerHTML={{ __html: toInlineSvg(svg) }}
    />
  );
}

function LogoFallback({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center font-heading text-xl font-bold text-white", className)}>
      {company.shortName}
    </span>
  );
}

function toInlineSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<svg\b([^>]*)>/i,
      (_, attrs: string) =>
        `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, "")} aria-hidden="true" focusable="false">`,
    )
    .trim();
}
