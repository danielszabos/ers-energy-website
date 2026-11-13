"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-driven animation for the roof-to-solar illustration.
 *
 * Pinning is plain CSS (position: sticky), so the browser handles it natively
 * and it stays smooth on mobile. GSAP only scrubs a timeline of opacity and
 * transform changes as the step captions scroll past. GSAP is loaded on
 * demand, and not at all when the visitor prefers reduced motion; they keep
 * the finished, static illustration rendered by the server.
 */
export function RoofToSolarScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia(root);
      mm.add(
        {
          desktop: "(min-width: 64rem)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop, motionOk } = context.conditions as Record<string, boolean>;
          if (!motionOk) return;

          const all = (name: string) =>
            gsap.utils.toArray<SVGElement | HTMLElement>(`[data-scene="${name}"]`, root);
          const one = (name: string) => all(name)[0];

          const drone = one("drone");
          const beam = one("drone-beam");
          const sun = one("sun");
          const steps = all("step");
          const bars = all("battery-bar");
          const panelsByRow = [0, 1, 2, 3].map((row) =>
            gsap.utils.toArray<SVGElement>(`[data-scene="panel"][data-row="${row}"]`, root),
          );

          // Rewind to the start: worn roof, no panels, morning light.
          gsap.set(all("worn"), { opacity: 1 });
          gsap.set(all("panel"), { opacity: 0, y: -18 });
          gsap.set(all("panel-glow"), { opacity: 0 });
          gsap.set([one("sky-night"), one("night-shade"), one("window-glow")], { opacity: 0 });
          gsap.set([...all("star"), ...all("window-lit")], { opacity: 0 });
          gsap.set(sun, { x: 140, y: 226, opacity: 1 });
          gsap.set(drone, { x: -90, y: 120, opacity: 1 });
          gsap.set(beam, { opacity: 0 });
          gsap.set(bars, { opacity: 0.2 });
          gsap.set([one("flow-roof"), one("flow-building")], { opacity: 0 });
          gsap.set(steps.slice(1), { opacity: 0.3 });
          gsap.set(one("progress"), { scaleX: 0, transformOrigin: "left center" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: one("steps"),
              start: desktop ? "top 55%" : "top 70%",
              end: desktop ? "bottom 55%" : "bottom 70%",
              scrub: 0.6,
            },
          });

          // 1. Survey: a drone sweeps the worn roof.
          tl.to(drone, { x: 300, y: 150, duration: 0.8, ease: "power1.out" }, 0.1)
            .to(beam, { opacity: 0.35, duration: 0.2 }, 0.8)
            .to(drone, { x: 760, duration: 1.4, ease: "sine.inOut" }, 0.9)
            .to(beam, { opacity: 0, duration: 0.2 }, 2.2)
            .to(drone, { x: 1120, y: 40, duration: 0.8, ease: "power1.in" }, 2.3);

          // 2. Refurbish: the sheets refresh one by one, following the survey.
          tl.to(all("worn"), { opacity: 0, duration: 0.5, stagger: 0.16 }, 1.4);

          // 3. Solar PV: panels are laid one row at a time, from the eave up.
          panelsByRow.forEach((row, i) => {
            tl.to(
              row,
              { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power2.out" },
              4.1 + i * 0.55,
            );
          });

          // 4. Generation: the sun crosses, a lime glow ripples through the
          // panels and the battery charges.
          tl.to(sun, { x: 520, duration: 2.2 }, 5.9)
            .to(sun, { y: 92, duration: 2.2, ease: "sine.out" }, 5.9)
            .to(
              all("panel-glow"),
              { opacity: 0.6, duration: 0.3, stagger: 0.16, yoyo: true, repeat: 3, ease: "sine.inOut" },
              6.2,
            )
            .to(one("flow-roof"), { opacity: 1, duration: 0.3 }, 6.3)
            .to(one("flow-roof"), { strokeDashoffset: -96, duration: 1.6 }, 6.3)
            .to(bars, { opacity: 1, duration: 0.25, stagger: 0.32 }, 6.5)
            .to(one("flow-roof"), { opacity: 0, duration: 0.3 }, 7.9);

          // 5. Storage: dusk falls, the windows light up from the battery.
          tl.to(sun, { x: 880, duration: 1.4 }, 8.1)
            .to(sun, { y: 470, duration: 1.4, ease: "sine.in" }, 8.1)
            .to(sun, { opacity: 0, duration: 0.4 }, 9.1)
            .to(one("sky-night"), { opacity: 1, duration: 1.2 }, 8.4)
            .to(one("night-shade"), { opacity: 0.55, duration: 1.2 }, 8.4)
            .to(all("star"), { opacity: 1, duration: 0.4, stagger: 0.04 }, 9.1)
            .to(one("flow-building"), { opacity: 1, duration: 0.3 }, 9.3)
            .to(one("flow-building"), { strokeDashoffset: -128, duration: 2.2 }, 9.3)
            .to(one("window-glow"), { opacity: 1, duration: 0.6 }, 9.4)
            .to(all("window-lit"), { opacity: 1, duration: 0.25, stagger: 0.05 }, 9.4)
            .to(bars.slice(2).reverse(), { opacity: 0.2, duration: 0.3, stagger: 0.45 }, 10.3);

          // Captions follow the animation, and the bar tracks overall progress.
          tl.to(steps[0], { opacity: 0.3, duration: 0.3 }, 3.8)
            .to(steps[1], { opacity: 1, duration: 0.3 }, 3.8)
            .to(steps[1], { opacity: 0.3, duration: 0.3 }, 7.9)
            .to(steps[2], { opacity: 1, duration: 0.3 }, 7.9)
            .to(one("progress"), { scaleX: 1, duration: 12 }, 0);
        },
      );
      revert = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
