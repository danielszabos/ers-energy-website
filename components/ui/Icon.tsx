import type { ReactNode } from "react";

// Line icons on a 24px grid, drawn with the current text colour.
const icons = {
  // Services
  roofing: (
    <>
      <path d="M2 11.5 12 7l10 4.5" />
      <path d="M4 10.6v9.9M20 10.6v9.9M2.5 20.5h19" />
      <path d="M9 20.5v-6h6v6M9 16.5h6M9 18.5h6" />
    </>
  ),
  solar: (
    <>
      <rect x="3" y="4" width="18" height="11" rx="1" />
      <path d="M3 9.5h18M9 4v11M15 4v11" />
      <path d="M12 15v4.5M8 19.5h8" />
    </>
  ),
  battery: (
    <>
      <rect x="2.5" y="7" width="17" height="10" rx="2" />
      <path d="M21.5 10.5v3" />
      <path d="M11.8 9.2 9.2 12.4h3.4l-2.4 3" />
    </>
  ),
  "metal-roof": (
    <>
      <path d="M2 9h1l1.1-3h2.4l1.1 3h2.1l1.1-3h2.4l1.1 3h2.1l1.1-3h2.4l1.1 3H22" />
      <path d="M2 9v10h20V9" />
      <path d="M5.3 6v13M12 6v13M18.7 6v13" />
    </>
  ),
  "cut-edge": (
    <>
      <path d="M12 3 19.5 6v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3Z" />
      <path d="M8 12.5h1.5l1-2h3l1 2H16" />
    </>
  ),
  gutter: (
    <>
      <path d="M2.5 6.5h19" />
      <path d="M4 9h16v2.5a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 11.5V9Z" />
      <path d="M14.5 15v6M17.5 15v6" />
      <path d="M8.2 19.8a1.3 1.3 0 0 0 2.6 0c0-.9-1.3-2.4-1.3-2.4s-1.3 1.5-1.3 2.4Z" />
    </>
  ),
  maintenance: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 4.5v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="m8.5 13 2.5 2.5 4.5-5" />
    </>
  ),

  // About: how ERS works
  drone: (
    <>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9.5 9.5 7.8 7.8M14.5 9.5l1.7-1.7M9.5 14.5l-1.7 1.7M14.5 14.5l1.7 1.7" />
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
    </>
  ),
  wrench: (
    <path d="M10.6 11.3A5 5 0 0 1 17.3 4.6l-1.8 1.8 2.1 2.1 1.8-1.8a5 5 0 0 1-6.7 6.7l-7.1 7.1a1.5 1.5 0 0 1-2.1-2.1l7.1-7.1Z" />
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M5.5 16.5 10 12l3 3 5.5-6" />
      <path d="M15 9h3.5v3.5" />
    </>
  ),

  // Testimonials
  quote: (
    <>
      <path d="M10 11.5H6.5a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1H9a1 1 0 0 1 1 1V13c0 2.6-1.6 4.2-4.2 4.6" />
      <path d="M18.5 11.5H15a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1V13c0 2.6-1.6 4.2-4.2 4.6" />
    </>
  ),

  // Awards
  trophy: (
    <>
      <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0V4Z" />
      <path d="M7.5 5.5h-3v1A3.5 3.5 0 0 0 8 10M16.5 5.5h3v1A3.5 3.5 0 0 1 16 10" />
      <path d="M12 13.5V17" />
      <path d="M8.5 20.5h7l-1-3.5h-5l-1 3.5Z" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
  ),

  // Interface
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: (
    <path d="M5.5 3.5h3l1.5 4.2-2 1.3a11 11 0 0 0 7 7l1.3-2 4.2 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="m3.5 17 5-5 4 4 2.5-2.5 5.5 5.5" />
      <circle cx="16" cy="9" r="1.5" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
