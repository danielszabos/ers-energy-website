import { findPublicImage } from "@/lib/assets";
import { cn } from "@/lib/cn";

// Logos are sized to roughly the same area rather than the same height, so a
// round badge and a wide wordmark look about as big as each other. `size` is
// the side of the square a 1:1 logo fills; `maxHeight` caps tall logos.
const tones = {
  // On white, in full colour.
  light: {
    size: 60,
    maxHeight: 64,
    image: "max-w-none",
    placeholder: "h-12 border-mid-grey/45 px-5 text-xs text-mid-grey",
  },
  // In the footer: small full-colour logos on light tiles so any artwork reads.
  // A logo too wide for its tile shrinks to fit, keeping its shape.
  dark: {
    size: 32,
    maxHeight: 34,
    image: "max-w-full object-contain",
    placeholder: "h-7 border-white/25 px-3 text-[0.6875rem] text-white/65",
  },
};

export function AccreditationLogo({
  slug,
  name,
  scale = 1,
  tone = "light",
  decorative = false,
}: {
  slug: string;
  name: string;
  /** Multiplies the logo's size, for optical balance with its neighbours. */
  scale?: number;
  tone?: keyof typeof tones;
  /** The name is already written next to the logo, so screen readers skip the image. */
  decorative?: boolean;
}) {
  const { size, maxHeight, image, placeholder } = tones[tone];
  const file = findPublicImage(`/accreditations/${slug}`);

  if (!file) {
    return (
      <span
        aria-hidden={decorative || undefined}
        className={cn(
          "inline-flex items-center rounded-[2px] border border-dashed font-heading font-semibold whitespace-nowrap",
          placeholder,
        )}
      >
        [{name}]
      </span>
    );
  }

  const aspect = file.width / file.height;
  const height = Math.min(maxHeight, Math.round((size * scale) / Math.sqrt(aspect)));
  const width = Math.round(height * aspect);
  const img = (
    // Logos keep their own proportions at a fixed height, so a plain <img>
    // with explicit dimensions is enough (and avoids layout shift).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={file.src}
      alt={decorative ? "" : name}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={cn("block", image)}
      style={{ height, width }}
    />
  );

  if (tone === "dark") {
    // Equal-size tiles, whatever the logo's shape: each fills its slot in the
    // footer's grid.
    return (
      <span className="flex h-12 w-full items-center justify-center rounded-[2px] bg-off-white px-1.5">
        {img}
      </span>
    );
  }
  return img;
}
