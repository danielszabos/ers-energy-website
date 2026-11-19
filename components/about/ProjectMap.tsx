"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { circleSize } from "./projectPlaces";

export type MapPlace = {
  id: string;
  name: string;
  note?: string;
  base?: boolean;
  label?: "left" | "right" | "above" | "below";
  /** Position on the whole map, in % of its width and height. */
  left: number;
  top: number;
  count: number;
};

/** Zoom, then shift in px. At k = 1 the whole UK fits the box. */
type View = { k: number; x: number; y: number };
/** Places drawn as one circle, at the position of the one with most projects. */
type Group = { leader: number; members: number[]; count: number };

const MAX_ZOOM = 16;
/** Circles closer than this (px, edge to edge) merge into one. */
const GAP = 3;
/** The map's width on large screens, used until the real width is measured. */
const DEFAULT_WIDTH = 368;
/** Names beside circles only appear once zoomed in this far. */
const NAMES_FROM_ZOOM = 2.5;
const FLY_MS = 450;

const clampZoom = (k: number) => Math.min(MAX_ZOOM, Math.max(1, k));

/**
 * Merges places whose circles would overlap at zoom `k`, so close neighbours
 * show as one numbered circle that splits apart as the map zooms in. A group
 * is drawn where its busiest place is, except that the base always leads the
 * group it's in, so the base stays where it is at every zoom.
 */
function groupPlaces(places: MapPlace[], k: number, width: number, height: number): Group[] {
  const pos = places.map((p) => [(p.left / 100) * width * k, (p.top / 100) * height * k]);
  const groups: Group[] = places.map((place, i) => ({ leader: i, members: [i], count: place.count }));

  const overlapping = (): [number, number] | null => {
    for (let a = 0; a < groups.length; a++) {
      for (let b = a + 1; b < groups.length; b++) {
        const [ax, ay] = pos[groups[a].leader];
        const [bx, by] = pos[groups[b].leader];
        const reach = (circleSize(groups[a].count) + circleSize(groups[b].count)) / 2 + GAP;
        if (Math.hypot(ax - bx, ay - by) < reach) return [a, b];
      }
    }
    return null;
  };

  for (let pair = overlapping(); pair; pair = overlapping()) {
    const [a, b] = pair;
    const first = groups[a];
    const second = groups[b];
    const firstLeads =
      !!places[first.leader].base || (!places[second.leader].base && first.count >= second.count);
    const [big, small] = firstLeads ? [first, second] : [second, first];
    groups[a] = {
      leader: big.leader,
      members: [...big.members, ...small.members],
      count: big.count + small.count,
    };
    groups.splice(b, 1);
  }
  return groups;
}

/**
 * The UK map with a circle for each place ERS has worked, sized by its number
 * of projects. It zooms with the + and − buttons, a pinch (two fingers on a
 * phone, or a trackpad), Ctrl or ⌘ + scroll, or a double click or tap, and
 * drags with a mouse. One finger still scrolls the page on a phone.
 *
 * Circles that would overlap merge into one numbered circle; zooming in splits
 * them, and each slides out to its own place. Selecting a numbered circle
 * zooms into it. Hovering, focusing or tapping a place shows its name and
 * number of projects.
 *
 * `children` is the outline: an SVG that fills the box at zoom 1.
 */
export function ProjectMap({
  places,
  aspectRatio,
  children,
}: {
  places: MapPlace[];
  /** Width divided by height. */
  aspectRatio: number;
  children: ReactNode;
}) {
  const [view, setViewState] = useState<View>({ k: 1, x: 0, y: 0 });
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [active, setActive] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  const sizeRef = useRef({ width: DEFAULT_WIDTH, height: DEFAULT_WIDTH / aspectRatio });
  const flightRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; from: View; moved: boolean } | null>(null);
  const height = width / aspectRatio;

  /** Sets the view, kept within the map so it can't be dragged away. */
  const setView = useCallback((next: View) => {
    const { width: w, height: h } = sizeRef.current;
    const k = clampZoom(next.k);
    const clamped = {
      k,
      x: Math.min(0, Math.max(w * (1 - k), next.x)),
      y: Math.min(0, Math.max(h * (1 - k), next.y)),
    };
    viewRef.current = clamped;
    setViewState(clamped);
  }, []);

  const land = useCallback(() => cancelAnimationFrame(flightRef.current), []);

  /** Animates to zoom `k` with the map point (mx, my), in px at zoom 1, in the middle. */
  const flyTo = useCallback(
    (k: number, mx: number, my: number) => {
      land();
      const { width: w, height: h } = sizeRef.current;
      const from = viewRef.current;
      const k1 = clampZoom(k);
      const cx = (w / 2 - from.x) / from.k;
      const cy = (h / 2 - from.y) / from.k;
      const at = (t: number) => {
        // Zoom evenly (in steps of ×), so zooming in and out feel the same.
        const kt = from.k * (k1 / from.k) ** t;
        setView({ k: kt, x: w / 2 - (cx + (mx - cx) * t) * kt, y: h / 2 - (cy + (my - cy) * t) * kt });
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return at(1);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FLY_MS);
        at(1 - (1 - t) ** 3);
        if (t < 1) flightRef.current = requestAnimationFrame(step);
      };
      flightRef.current = requestAnimationFrame(step);
    },
    [land, setView],
  );

  /** Zooms to `k`, keeping the map under the point (px, py) of the box still. */
  const zoomAround = useCallback(
    (k: number, px: number, py: number, animate: boolean) => {
      const from = viewRef.current;
      const k1 = clampZoom(k);
      const mx = (px - from.x) / from.k;
      const my = (py - from.y) / from.k;
      if (!animate) {
        land();
        return setView({ k: k1, x: px - mx * k1, y: py - my * k1 });
      }
      const { width: w, height: h } = sizeRef.current;
      flyTo(k1, (w / 2 - px) / k1 + mx, (h / 2 - py) / k1 + my);
    },
    [flyTo, land, setView],
  );

  const zoomBy = (factor: number) => {
    const { width: w, height: h } = sizeRef.current;
    const v = viewRef.current;
    flyTo(v.k * factor, (w / 2 - v.x) / v.k, (h / 2 - v.y) / v.k);
  };

  const showAll = () => flyTo(1, sizeRef.current.width / 2, sizeRef.current.height / 2);

  // Measure the box, and keep the same part of the map in view if it resizes.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const w = box.clientWidth;
      if (!w || w === sizeRef.current.width) return;
      const ratio = w / sizeRef.current.width;
      sizeRef.current = { width: w, height: w / aspectRatio };
      setWidth(w);
      const v = viewRef.current;
      setView({ k: v.k, x: v.x * ratio, y: v.y * ratio });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [aspectRatio, setView]);

  // Ctrl or ⌘ + scroll (and a trackpad pinch, which browsers send the same way)
  // zooms. A plain scroll is left to the page, with a hint on how to zoom.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let hintTimer = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const rect = box.getBoundingClientRect();
        const rate = event.deltaMode === 1 ? 0.05 : 0.0025;
        const factor = Math.min(1.6, Math.max(0.6, Math.exp(-event.deltaY * rate)));
        zoomAround(viewRef.current.k * factor, event.clientX - rect.left, event.clientY - rect.top, false);
        return;
      }
      const key = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl";
      setHint(`Hold ${key} and scroll to zoom the map`);
      clearTimeout(hintTimer);
      hintTimer = window.setTimeout(() => setHint(null), 1500);
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      box.removeEventListener("wheel", onWheel);
      clearTimeout(hintTimer);
    };
  }, [zoomAround]);

  // Touch: two fingers pinch and move the map; a double tap zooms in. One
  // finger is left to scroll the page (touch-action: pan-y on the box).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    type Point = { x: number; y: number };
    let pinch: { distance: number; mid: Point; from: View } | null = null;
    let tap: (Point & { time: number }) | null = null;
    let lastTap: (Point & { time: number }) | null = null;
    const at = (touch: Touch): Point => {
      const rect = box.getBoundingClientRect();
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };
    const pair = (touches: TouchList) => {
      const a = at(touches[0]);
      const b = at(touches[1]);
      return { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    };
    const onStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        land();
        pinch = { ...pair(event.touches), from: viewRef.current };
        tap = null;
      } else if (event.touches.length === 1 && !(event.target as Element).closest("button")) {
        tap = { ...at(event.touches[0]), time: event.timeStamp };
      } else {
        tap = null;
      }
    };
    const onMove = (event: TouchEvent) => {
      if (pinch && event.touches.length === 2) {
        event.preventDefault();
        const now = pair(event.touches);
        const { from } = pinch;
        const k = clampZoom((from.k * now.distance) / pinch.distance);
        // The map point that was under the fingers stays under them.
        const mx = (pinch.mid.x - from.x) / from.k;
        const my = (pinch.mid.y - from.y) / from.k;
        setView({ k, x: now.mid.x - mx * k, y: now.mid.y - my * k });
      } else if (tap) {
        const p = at(event.touches[0]);
        if (Math.hypot(p.x - tap.x, p.y - tap.y) > 10) tap = null;
      }
    };
    const onEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinch = null;
      if (tap && event.touches.length === 0 && event.timeStamp - tap.time < 300) {
        const double =
          lastTap && tap.time - lastTap.time < 350 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 30;
        if (double) {
          event.preventDefault();
          zoomAround(viewRef.current.k * 2, tap.x, tap.y, true);
          lastTap = null;
        } else {
          lastTap = tap;
          setActive(null);
        }
      }
      tap = null;
    };
    box.addEventListener("touchstart", onStart, { passive: true });
    box.addEventListener("touchmove", onMove, { passive: false });
    box.addEventListener("touchend", onEnd, { passive: false });
    box.addEventListener("touchcancel", onEnd);
    return () => {
      box.removeEventListener("touchstart", onStart);
      box.removeEventListener("touchmove", onMove);
      box.removeEventListener("touchend", onEnd);
      box.removeEventListener("touchcancel", onEnd);
    };
  }, [land, setView, zoomAround]);

  // A tap or click outside the map, or Escape, hides the open label.
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setActive(null);
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

  useEffect(() => land, [land]);

  // Mouse: drag to move around, double click to zoom in.
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if ((event.target as Element).closest("button")) return;
    land();
    dragRef.current = { x: event.clientX, y: event.clientY, from: viewRef.current, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 3) return;
    drag.moved = true;
    setView({ k: drag.from.k, x: drag.from.x + dx, y: drag.from.y + dy });
  }
  function onPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && !drag.moved) setActive(null);
  }
  function onDoubleClick(event: ReactMouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    zoomAround(viewRef.current.k * 2, event.clientX - rect.left, event.clientY - rect.top, true);
  }

  const groups = useMemo(() => groupPlaces(places, view.k, width, height), [places, view.k, width, height]);
  const groupOf = useMemo(() => {
    const map = new Map<number, Group>();
    for (const group of groups) for (const i of group.members) map.set(i, group);
    return map;
  }, [groups]);

  function zoomInto(group: Group) {
    const { width: w, height: h } = sizeRef.current;
    const xs = group.members.map((i) => (places[i].left / 100) * w);
    const ys = group.members.map((i) => (places[i].top / 100) * h);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    // Fit the group with room around it, and always zoom in far enough to split it.
    const fit = Math.min((w - 96) / Math.max(x1 - x0, 1), (h - 96) / Math.max(y1 - y0, 1));
    flyTo(Math.max(viewRef.current.k * 2, fit), (x0 + x1) / 2, (y0 + y1) / 2);
  }

  /** Brings a place into view when it's reached with the keyboard. */
  function keepInView(place: MapPlace) {
    const { width: w, height: h } = sizeRef.current;
    const v = viewRef.current;
    const x = (place.left / 100) * w * v.k + v.x;
    const y = (place.top / 100) * h * v.k + v.y;
    if (x < 32 || x > w - 32 || y < 32 || y > h - 32) flyTo(v.k, (place.left / 100) * w, (place.top / 100) * h);
  }

  // Bigger circles first, so smaller ones are drawn on top; the base last of all.
  const order = places.map((_, i) => i).sort((a, b) => Number(!!places[a].base) - Number(!!places[b].base));

  return (
    <div ref={wrapRef}>
      <div className="relative">
        <div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          className={cn(
            "relative touch-pan-y overflow-hidden select-none",
            view.k > 1 && "cursor-grab active:cursor-grabbing",
            // Zoomed in, the land runs to the edges: fade them so it reads as a close-up.
            view.k > 1.15 &&
              "[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent),linear-gradient(to_bottom,transparent,#000_3%,#000_97%,transparent)] [mask-composite:intersect]",
          )}
          style={{ aspectRatio, "--map-zoom": view.k.toFixed(4) } as CSSProperties}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${view.x.toFixed(2)}px, ${view.y.toFixed(2)}px) scale(${view.k.toFixed(4)})`,
            }}
          >
            {children}
          </div>

          <ul aria-label="Project locations">
            {order.map((i) => {
              const place = places[i];
              const group = groupOf.get(i) ?? { leader: i, members: [i], count: place.count };
              const leader = places[group.leader];
              const isLeader = group.leader === i;
              const merged = !isLeader;
              const cluster = isLeader && group.members.length > 1;
              // Where this place and its group's circle are in the box, in px.
              const ownX = (place.left / 100) * width * view.k + view.x;
              const ownY = (place.top / 100) * height * view.k + view.y;
              const leadX = (leader.left / 100) * width * view.k + view.x;
              const leadY = (leader.top / 100) * height * view.k + view.y;
              return (
                <Pin
                  key={place.id}
                  place={place}
                  view={view}
                  merged={merged}
                  cluster={cluster ? { leader: leader.name, places: group.members.length, count: group.count } : null}
                  offset={merged ? [leadX - ownX, leadY - ownY] : [0, 0]}
                  screen={[ownX / width, ownY / height]}
                  named={!!place.label && !merged && !cluster && view.k >= NAMES_FROM_ZOOM}
                  shown={active === place.id}
                  onShow={() => setActive(place.id)}
                  onHide={() => setActive((current) => (current === place.id ? null : current))}
                  onSelect={() => {
                    if (!cluster) return setActive(place.id);
                    setActive(null);
                    zoomInto(group);
                  }}
                  onFocusPin={() => keepInView(place)}
                />
              );
            })}
          </ul>
        </div>

        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          <ZoomButton label="Zoom in" icon="plus" disabled={view.k >= MAX_ZOOM} onClick={() => zoomBy(2)} />
          <ZoomButton label="Zoom out" icon="minus" disabled={view.k <= 1} onClick={() => zoomBy(0.5)} />
          <ZoomButton label="Show the whole UK" icon="fit" disabled={view.k <= 1} onClick={showAll} />
        </div>

        <p
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-8 top-1/2 z-20 -translate-y-1/2 rounded-[2px] bg-deep-base/90 px-4 py-3 text-center text-sm text-white shadow-card transition-opacity duration-300",
            hint ? "opacity-100" : "opacity-0",
          )}
        >
          {hint}
        </p>
      </div>

      <p className="mt-5 text-center text-sm leading-relaxed text-pretty text-white/60">
        <span className="[@media(pointer:coarse)]:hidden">
          Zoom with + and −, or hold Ctrl and scroll. Drag to move around.
        </span>
        <span className="hidden [@media(pointer:coarse)]:inline">
          Pinch with two fingers, or use + and −, to zoom.
        </span>{" "}
        Select a numbered circle to zoom into that area.
      </p>
    </div>
  );
}

function ZoomButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconName;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-deep-base/85 text-white shadow-card transition-[color,background-color,border-color,opacity] duration-200 hover:border-white hover:bg-white hover:text-deep-base disabled:pointer-events-none disabled:opacity-35"
    >
      <span className="sr-only">{label}</span>
      <Icon name={icon} className="size-4" strokeWidth={2.25} />
    </button>
  );
}

function Pin({
  place,
  view,
  merged,
  cluster,
  offset,
  screen,
  named,
  shown,
  onShow,
  onHide,
  onSelect,
  onFocusPin,
}: {
  place: MapPlace;
  view: View;
  /** Drawn as part of another place's circle at this zoom, so hidden. */
  merged: boolean;
  /** Set when this place's circle stands for nearby places too. */
  cluster: { leader: string; places: number; count: number } | null;
  /** From this place to its group's circle, in px. */
  offset: [number, number];
  /** Where it is in the box, as fractions of its width and height. */
  screen: [number, number];
  named: boolean;
  shown: boolean;
  onShow: () => void;
  onHide: () => void;
  onSelect: () => void;
  onFocusPin: () => void;
}) {
  const count = cluster ? cluster.count : place.count;
  const size = circleSize(count);
  // Just bigger than the circle, so close neighbours don't block each other.
  const hit = Math.max(size + 6, 16);
  const [sx, sy] = screen;
  const align = sx < 0.22 ? "start" : sx > 0.78 ? "end" : "center";
  const below = sy < 0.12;
  const others = cluster ? cluster.places - 1 : 0;
  const title = cluster ? `${cluster.leader} and ${others} nearby ${others === 1 ? "place" : "places"}` : place.name;
  const detail = `${place.note && !cluster ? ` · ${place.note}` : ""} · ${projectCount(count)}`;
  const gap = `calc(50% + ${(size / 2 + 4).toFixed(1)}px)`;
  const nameStyle: CSSProperties | undefined =
    place.label === "right"
      ? { left: gap, top: "50%", translate: "0 -50%" }
      : place.label === "left"
        ? { right: gap, top: "50%", translate: "0 -50%" }
        : place.label === "above"
          ? { bottom: gap, left: "50%", translate: "-50% 0" }
          : place.label === "below"
            ? { top: gap, left: "50%", translate: "-50% 0" }
            : undefined;

  return (
    <li
      inert={merged}
      className={cn("absolute", shown && "z-20", place.base && "z-10")}
      // Placed in % of the box, so it's right before the box is measured too.
      style={{
        left: `calc(${place.left.toFixed(2)}% * ${view.k.toFixed(4)} + ${view.x.toFixed(2)}px)`,
        top: `calc(${place.top.toFixed(2)}% * ${view.k.toFixed(4)} + ${view.y.toFixed(2)}px)`,
      }}
    >
      {/* Slides into its group's circle when merged, and back out when it splits. */}
      <span
        className={cn(
          "absolute top-0 left-0 transition-[translate,opacity] duration-500 ease-out-soft motion-reduce:transition-none",
          merged ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        style={{ translate: `${offset[0].toFixed(1)}px ${offset[1].toFixed(1)}px` }}
      >
        <button
          type="button"
          onPointerEnter={(event) => event.pointerType === "mouse" && onShow()}
          onPointerLeave={(event) => event.pointerType === "mouse" && onHide()}
          onFocus={() => {
            onShow();
            onFocusPin();
          }}
          onBlur={onHide}
          onClick={onSelect}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
          style={{ width: hit, height: hit }}
        >
          <span className="sr-only">
            {title}
            {detail.replace(/ · /g, ", ")}
            {cluster ? ". Zooms in." : ""}
          </span>
          {place.base && (
            <span
              aria-hidden="true"
              className="absolute rounded-full bg-lime/20"
              style={{ width: size + 12, height: size + 12 }}
            />
          )}
          <span
            aria-hidden="true"
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full font-heading leading-none font-bold text-deep-base ring-2 ring-deep-base transition-[width,height,scale] duration-300 motion-reduce:transition-none",
              place.base ? "bg-lime" : "bg-white",
              // A soft outer ring marks a circle that stands for several places
              // (the base has its own lime one).
              cluster && !place.base && "shadow-[0_0_0_5px_rgb(255_255_255/0.16)]",
            )}
            style={{
              width: size,
              height: size,
              scale: shown ? "1.15" : "1",
              fontSize: `${Math.min(13, Math.max(8, size * 0.42)).toFixed(1)}px`,
            }}
          >
            {cluster ? count : null}
          </span>
          {nameStyle && (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute font-heading text-[0.6875rem] font-semibold whitespace-nowrap text-white/75 transition-opacity duration-300 [text-shadow:0_1px_3px_var(--color-deep-base)]",
                named && !shown ? "opacity-100" : "opacity-0",
              )}
              style={nameStyle}
            >
              {place.name}
            </span>
          )}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bg-white px-2.5 py-1.5 text-left font-heading text-xs font-semibold whitespace-nowrap text-deep-base shadow-card transition-[opacity,translate] duration-200 motion-reduce:transition-none",
              below ? "top-full mt-1" : "bottom-full mb-1",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "start" && "left-0",
              align === "end" && "right-0",
              shown ? "opacity-100" : cn("opacity-0", below ? "-translate-y-1" : "translate-y-1"),
            )}
          >
            {title}
            <span className="font-sans font-normal text-mid-grey">{detail}</span>
            {cluster && (
              <span className="mt-0.5 block font-sans text-[0.6875rem] font-normal text-deep-green">
                Select to zoom in
              </span>
            )}
          </span>
        </button>
      </span>
    </li>
  );
}

function projectCount(count: number) {
  return `${count} ${count === 1 ? "project" : "projects"}`;
}
