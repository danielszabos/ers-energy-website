"use client";

import { useSyncExternalStore } from "react";

// The year never needs watching for changes within a visit.
const subscribe = () => () => {};

/**
 * This year, so the footer's © line stays current without anyone rebuilding the
 * site. Pages are built once as static HTML, so the HTML carries `fallback`
 * (the year the site went live) and the browser swaps in the real year as the
 * page loads. Visitors without JavaScript, and search engines, see `fallback`.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}
