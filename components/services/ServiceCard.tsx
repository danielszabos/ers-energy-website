import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/lib/site";

// Shared by the homepage and the Services page so the two boxes stay identical.
// On phones the card lies flat (icon beside the text); from sm up the icon sits on top.
const cardClass =
  "relative flex h-full items-start gap-4 border border-border-grey bg-white p-5 transition-[translate,box-shadow] duration-300 ease-out after:absolute after:-inset-x-px after:-bottom-px after:h-[3px] after:origin-left after:scale-x-0 after:bg-brand-green after:transition-transform after:duration-300 hover:-translate-y-1 hover:shadow-card hover:after:scale-x-100 focus-visible:-translate-y-1 focus-visible:after:scale-x-100 motion-reduce:hover:translate-y-0 sm:flex-col sm:gap-0 sm:p-6 lg:p-7";

/**
 * A service box. With `onOpen` (Services page) a plain click opens the service's
 * details window instead of following the link; ctrl/cmd-click still opens the
 * link (/services#solar-pv) in a new tab, which opens the same window there.
 */
export function ServiceCard({
  service,
  href,
  onOpen,
}: {
  service: Service;
  href: string;
  onOpen?: () => void;
}) {
  return (
    <Link
      href={href}
      id={onOpen ? service.id : undefined}
      aria-haspopup={onOpen ? "dialog" : undefined}
      onClick={
        onOpen
          ? (event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              onOpen();
            }
          : undefined
      }
      className={cardClass}
    >
      <span className="flex size-11 shrink-0 items-center justify-center bg-green-tint text-deep-green sm:size-12">
        <Icon name={service.icon} className="size-6" />
      </span>
      <div className="min-w-0 flex-1 sm:mt-6 sm:flex-none">
        <h3 className="text-lg font-semibold text-deep-base">{service.title}</h3>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-charcoal sm:mt-2">
          {service.summary}
        </p>
      </div>
    </Link>
  );
}
