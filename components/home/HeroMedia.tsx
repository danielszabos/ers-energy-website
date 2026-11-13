"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/cn";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Video only plays for visitors who haven't asked for reduced motion or
// reduced data. The server render always starts with the poster alone.
function useVideoAllowed() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () =>
      !window.matchMedia(reducedMotionQuery).matches &&
      !(navigator as NavigatorWithConnection).connection?.saveData,
    () => false,
  );
}

export function HeroMedia({
  video,
  poster,
}: {
  video: string | null;
  poster: string | null;
}) {
  const allowed = useVideoAllowed();
  const showVideo = Boolean(video) && allowed;
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [playing, setPlaying] = useState(false);

  // Play only while the hero is on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    // Reuse the optimised poster the browser already downloaded.
    if (posterRef.current?.currentSrc) el.poster = posterRef.current.currentSrc;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  // Hidden routes stay in the DOM, so pause explicitly when this unmounts or hides.
  useLayoutEffect(() => {
    const el = videoRef.current;
    return () => el?.pause();
  }, [showVideo]);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-20">
      {poster ? (
        <Image
          ref={posterRef}
          src={poster}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-end justify-end bg-[radial-gradient(ellipse_at_70%_30%,var(--color-charcoal),var(--color-deep-base)_70%)] p-6 font-heading text-xs font-semibold text-white/50">
          [Hero poster: /videos/hero-poster.jpg]
        </div>
      )}
      {showVideo && video && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
