"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type MapPin = {
  id: string;
  name: string;
  note?: string;
  /** Position on the map, in % of its width and height. */
  left: number;
  top: number;
  base?: boolean;
  /** Draws the marker this many px from the real spot, joined by a short line. */
  nudge?: [number, number];
  /** Shows the name beside the pin instead of above it, to keep a neighbour in view. */
  labelRight?: boolean;
};

/**
 * The pins over the UK map. Hovering, focusing or tapping a pin shows its name;
 * a tap anywhere else or Escape hides it again.
 */
export function MapPins({ pins }: { pins: MapPin[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!listRef.current?.contains(event.target as Node)) setActive(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const hide = (id: string) => setActive((current) => (current === id ? null : current));

  return (
    <ul ref={listRef} aria-label="Locations on the map" className="absolute inset-0">
      {pins.map((pin) => {
        const [dx, dy] = pin.nudge ?? [0, 0];
        const shown = active === pin.id;
        return (
          <li
            key={pin.id}
            className="absolute"
            style={{ left: `${pin.left.toFixed(2)}%`, top: `${pin.top.toFixed(2)}%` }}
          >
            {pin.nudge && (
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px origin-left bg-white/55"
                // Rounded: the browser shortens long decimals in inline styles,
                // which would no longer match what React renders on the client.
                style={{
                  width: `${Math.hypot(dx, dy).toFixed(1)}px`,
                  transform: `rotate(${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1)}deg)`,
                }}
              />
            )}
            <button
              type="button"
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(pin.id)}
              onPointerLeave={(event) => event.pointerType === "mouse" && hide(pin.id)}
              onFocus={() => setActive(pin.id)}
              onBlur={() => hide(pin.id)}
              onClick={() => setActive(pin.id)}
              className="absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ left: dx, top: dy } as CSSProperties}
            >
              {pin.base && (
                <span aria-hidden="true" className="absolute size-7 rounded-full bg-lime/20" />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative rounded-full ring-2 ring-deep-base transition-transform duration-200",
                  pin.base ? "size-3.5 bg-lime" : "size-2.5 bg-white",
                  shown && "scale-125",
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute bg-white px-2.5 py-1.5 font-heading text-xs font-semibold whitespace-nowrap text-deep-base shadow-card transition-[opacity,translate] duration-200 motion-reduce:transition-none",
                  pin.labelRight
                    ? "top-1/2 left-full -translate-y-1/2"
                    : "bottom-full left-1/2 mb-1 -translate-x-1/2",
                  shown ? "opacity-100" : cn("opacity-0", pin.labelRight ? "-translate-x-1" : "translate-y-1"),
                )}
              >
                {pin.name}
                {pin.note && <span className="font-sans font-normal text-mid-grey"> · {pin.note}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
