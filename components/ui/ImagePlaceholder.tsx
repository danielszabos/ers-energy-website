import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** Stand-in for a photo that hasn't been added to /public yet. */
export function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 bg-off-white bg-[repeating-linear-gradient(135deg,var(--color-border-grey)_0_1px,transparent_1px_14px)] text-mid-grey",
        className,
      )}
    >
      <Icon name="image" className="size-7" />
      <span className="font-heading text-sm font-semibold">{label}</span>
    </div>
  );
}
