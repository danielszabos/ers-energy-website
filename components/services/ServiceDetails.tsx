"use client";

import { useEffect, useRef } from "react";
import { ButtonLink, buttonClasses } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/lib/site";
import { ServiceCard } from "./ServiceCard";

/**
 * A Services page card and the window it opens. The window is a native modal
 * <dialog>, so focus stays inside it, Escape closes it and focus returns to the
 * card afterwards. The address bar follows it (/services#solar-pv), which is also
 * how the homepage cards open it on arrival.
 */
export function ServiceDetails({ service, delay }: { service: Service; delay: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hash = `#${service.id}`;
  const titleId = `${service.id}-details-title`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open && window.location.hash === hash) dialog.showModal();
  }, [hash]);

  const open = () => {
    dialogRef.current?.showModal();
    window.history.replaceState(null, "", hash);
  };

  const close = () => dialogRef.current?.close();

  // Runs however the window closes: the close button, Escape or the backdrop.
  const clearHash = () => {
    if (window.location.hash === hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <Reveal delay={delay} className="h-full">
        <ServiceCard service={service} href={hash} onOpen={open} />
      </Reveal>

      {/* No display class here: a closed <dialog> must stay display: none. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={clearHash}
        // A click on the dialog element itself is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="service-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain bg-white text-charcoal shadow-card backdrop:bg-deep-base/75"
      >
        <div className="relative border-t-4 border-brand-green p-6 pt-8 sm:p-10">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 flex size-11 items-center justify-center text-mid-grey transition-colors hover:text-deep-base sm:top-4 sm:right-4"
          >
            <Icon name="close" className="size-6" />
          </button>

          <span className="flex size-12 items-center justify-center bg-green-tint text-deep-green">
            <Icon name={service.icon} className="size-6" />
          </span>
          <h2
            id={titleId}
            className="mt-6 pr-10 text-2xl leading-tight font-bold tracking-[-0.01em] text-deep-base sm:text-3xl"
          >
            {service.title}
          </h2>
          <p className="mt-3 text-lg font-medium text-deep-base">{service.summary}</p>
          <p className="mt-4 leading-relaxed">{service.description}</p>

          <h3 className="mt-8 font-heading text-xs font-semibold tracking-[0.16em] text-deep-green uppercase">
            What&apos;s included
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-6">
            {service.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" strokeWidth={2} className="mt-0.5 size-5 shrink-0 text-deep-green" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            <button type="button" onClick={close} className={buttonClasses({ variant: "outline-dark" })}>
              Back to services
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
