// Site-wide content. Anything in [square brackets] is placeholder copy to replace.

export const company = {
  name: "ERS Energy Ltd",
  shortName: "ERS Energy",
  phone: {
    display: "01942 368021",
    href: "tel:+441942368021",
  },
  address: ["Leigh Works", "Bradshawgate", "Leigh", "WN7 1AP"],
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
] as const;

export type ServiceIcon =
  | "roofing"
  | "solar"
  | "battery"
  | "metal-roof"
  | "cut-edge"
  | "gutter"
  | "maintenance";

export type Service = {
  id: string;
  title: string;
  /** One line, shown on the cards. */
  summary: string;
  /** Shown in the window that opens from a card on the Services page. */
  description: string;
  includes: string[];
  icon: ServiceIcon;
};

// The descriptions and "What's included" lists are draft copy: check them
// against what ERS actually offers before launch.
export const services: Service[] = [
  {
    id: "commercial-roofing",
    title: "Commercial Roofing",
    summary:
      "New roofs and full replacements for industrial and commercial buildings.",
    description:
      "We install new roofs and carry out full replacements on industrial and commercial buildings, from warehouses and factories to offices and retail units. Every job starts with a survey, so the roof we recommend suits the building, how it's used and the budget.",
    includes: [
      "Roof surveys and condition reports",
      "Full strip-out and replacement",
      "Insulation upgrades",
      "Rooflights, flashings and drainage",
    ],
    icon: "roofing",
  },
  {
    id: "solar-pv",
    title: "Solar PV",
    summary: "Systems designed around your building's energy use.",
    description:
      "We design solar PV systems around how your building actually uses energy, so more of what you generate is used on site. Because we're roofers too, we make sure the roof can carry the system for its whole life before anything goes up.",
    includes: [
      "Energy use review and system design",
      "Roof survey before installation",
      "Grid connection applications",
      "Monitoring so you can see what it generates",
    ],
    icon: "solar",
  },
  {
    id: "battery-storage",
    title: "Battery Storage",
    summary: "Store the energy you generate and use it when you need it.",
    description:
      "A battery stores the solar power you don't use straight away, so you can use it later instead of exporting it cheaply and buying it back at full price. It can be fitted with a new solar system or added to one you already have.",
    includes: [
      "Sizing based on your usage and generation",
      "Fitting with new or existing solar PV",
      "Controls that charge and discharge at the right times",
      "Monitoring of charge, use and savings",
    ],
    icon: "battery",
  },
  {
    id: "metal-roofs",
    title: "Metal Roofs",
    summary:
      "Repair, overcladding and refurbishment of profiled metal roofs.",
    description:
      "Profiled metal roofs can last for decades with the right care. We repair, overclad and refurbish them to stop leaks and extend their life, often without the cost and disruption of a full replacement.",
    includes: [
      "Sheet repairs and replacement",
      "Overcladding over the existing roof",
      "Fixings, laps and seals",
      "Protective coatings",
    ],
    icon: "metal-roof",
  },
  {
    id: "cut-edge-corrosion",
    title: "Cut Edge Corrosion",
    summary:
      "Treating rust along sheet edges before it spreads and causes leaks.",
    description:
      "The cut edges of metal roof sheets are where the protective coating is thinnest, and where rust usually starts. Left alone, it spreads up the sheet and leads to leaks. Treating it early stops it before it does real damage.",
    includes: [
      "Cleaning back rust and loose coating",
      "Priming the exposed metal",
      "Sealing the edges with a protective coating",
      "Checks on laps and fixings while we're there",
    ],
    icon: "cut-edge",
  },
  {
    id: "gutter-refurbishment",
    title: "Gutter Refurbishment",
    summary: "Cleaning, sealing and lining to extend gutter life.",
    description:
      "Blocked or leaking gutters let water into the building and cause damp, damage and disruption. Refurbishing them is usually quicker and cheaper than replacing them, and adds years to their life.",
    includes: [
      "Clearing and cleaning",
      "Sealing joints and leaks",
      "Gutter lining",
      "Outlet and downpipe checks",
    ],
    icon: "gutter",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    summary:
      "Planned inspections and repairs to keep roofs and systems performing.",
    description:
      "Regular inspections catch small problems before they turn into leaks or lost generation. We look after roofs and solar systems on a planned schedule, and report back clearly after every visit.",
    includes: [
      "Planned roof inspections",
      "Solar PV checks and cleaning",
      "Repairs when you need them",
      "Written condition reports",
    ],
    icon: "maintenance",
  },
];

// Logo files live in /public/accreditations/{slug}.png (or .svg/.webp/.jpg).
// Logos are sized to equal area; `scale` nudges one that still looks too heavy
// (solid shapes) or too light (thin outlines) next to the others.
// `description` is the line under the logo on the About page; bodies without
// one are left off that page.
export const accreditations: {
  slug: string;
  name: string;
  scale?: number;
  description?: string;
}[] = [
  {
    slug: "mcs",
    name: "MCS",
    scale: 0.85,
    description:
      "Certified solar installer, required for export payments on the electricity you send to the grid.",
  },
  {
    slug: "recc",
    name: "RECC",
    description:
      "Member of the Renewable Energy Consumer Code, protecting customers who buy renewable systems.",
  },
  {
    slug: "hies",
    name: "HIES",
    scale: 0.92,
    description: "Consumer code membership covering energy system installations.",
  },
  { slug: "trading-standards", name: "Trading Standards Approved Code", scale: 1.06 },
  {
    slug: "institute-of-roofing",
    name: "The Institute of Roofing",
    scale: 0.95,
    description: "Recognised professional roofing body.",
  },
  {
    slug: "corc",
    name: "Confederation of Roofing Contractors",
    description: "Roofing trade association membership.",
  },
  {
    slug: "chas",
    name: "CHAS",
    scale: 0.95,
    description: "Health and safety assessment trusted by commercial clients.",
  },
  {
    slug: "safecontractor",
    name: "SafeContractor",
    description: "Independent health and safety accreditation.",
  },
  {
    slug: "constructionline",
    name: "Constructionline",
    description: "Pre-qualified supplier for commercial and public sector work.",
  },
  {
    slug: "napit",
    name: "NAPIT",
    description: "Approved for electrical installation work.",
  },
];

export const awards: {
  result: string;
  category: string;
  year: string;
  icon: "trophy" | "star";
}[] = [
  { result: "Winner", category: "Small Project (under £250K)", year: "2023", icon: "trophy" },
  { result: "Commended", category: "Large Project (over £250K)", year: "2023", icon: "star" },
  { result: "Winner", category: "Solar PV Installer and Contractor", year: "2020", icon: "trophy" },
  { result: "Highly Commended", category: "Small Project of the Year", year: "2020", icon: "star" },
];

export type FeaturedProject = {
  name: string;
  location: string;
  problem: string;
  work: string;
  result: string;
  image: string;
  alt: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  imagePosition?: string;
  /**
   * Shown as a big number, its `unit` in smaller type beside it, and a small
   * label underneath. The number in `value` counts up from 0; any text around
   * it (brackets, %) is kept as written. A value with no digits yet, like
   * "[X]", is shown as it is.
   */
  figures: { value: string; unit?: string; label: string }[];
};

// Homepage "Built on a roof that lasts" carousel.
export const featuredProjects: FeaturedProject[] = [
  {
    name: "J Heebink",
    location: "Trafford Park, Manchester",
    problem:
      "Working towards carbon neutrality, with an ageing roof and external walls that needed upgrading.",
    work: "Full external wall cladding, an overcladded roof and a solar PV system with performance monitoring.",
    result: "Delivered on time, with an app tracking the system's performance and CO₂ savings.",
    image: "/projects/J_Heebink.jpeg",
    alt: "Two-storey commercial building with new dark grey wall cladding and red columns",
    // SAMPLE figures for previewing the layout. Replace with the real numbers.
    figures: [
      { value: "2,400", unit: "m²", label: "roof overcladded" },
      { value: "150", unit: "kWp", label: "solar installed" },
      { value: "26", unit: "t", label: "CO₂ saved a year" },
    ],
  },
  {
    name: "Highspeed Engineering",
    location: "West Bromwich",
    problem:
      "An ageing asbestos cement roof that was becoming brittle and prone to leaks, with energy costs rising across the site.",
    work: "Safe, licensed removal of the asbestos sheets, a new insulated metal roof, then a solar PV system installed on top.",
    result:
      "A safe, watertight roof with better insulation, and a building now generating its own electricity during the working day.",
    image: "/projects/Highspeed Engineering.jpeg",
    alt: "Aerial view of a factory roof with rows of new solar panels being installed",
    // SAMPLE figures for previewing the layout. Replace with the real numbers.
    figures: [
      { value: "4,500", unit: "m²", label: "new roof" },
      { value: "100", unit: "kWp", label: "solar installed" },
      { value: "30%", label: "lower energy bills" },
    ],
  },
  {
    name: "EFCO",
    location: "Wellingborough",
    problem:
      "A large warehouse roof producing nothing, while the business paid full price for the electricity it used every day.",
    work: "Designed and installed a large-scale solar PV array across the main roof, fitted directly to the existing metal roof sheets.",
    result:
      "A roof that now generates a large share of the site’s daytime electricity, cutting energy costs and carbon emissions.",
    image: "/projects/EFCO_solar.jpeg",
    alt: "Rows of solar panels installed across a large commercial roof",
    // SAMPLE figures for previewing the layout. Replace with the real numbers.
    figures: [
      { value: "250", unit: "kWp", label: "solar installed" },
      { value: "575", unit: "panels", label: "fitted" },
      { value: "44", unit: "t", label: "CO₂ saved a year" },
    ],
  },
];

// Homepage testimonials, shown one at a time. Each string in `quote` is a paragraph.
export const testimonials: { quote: string[]; name: string; role: string }[] = [
  {
    quote: [
      "ERS Energy were patient during our decision-making process, no hard sell approach and subsequently installed solar panels and cladding at our Manchester business premises.",
      "We found ERS excellent from the very beginning, offering knowledgeable advice and guidance supported with a realistic costing for the works we required. The project management and installation were both great and we've been impressed throughout the project including the final outcome, that delivered on time. The solar system comes with a very handy App which monitors performance, offering useful information including details of CO₂ savings, supporting our drive towards carbon neutrality.",
    ],
    name: "Simon Hartley",
    role: "J Heebink, Trafford Park",
  },
  // PLACEHOLDER reviews (layout preview only): replace with real customer
  // reviews before the site goes live.
  {
    quote: [
      "The team surveyed our roof with a drone, explained exactly what needed doing and gave us a clear, fair quote. The refurbishment was finished on schedule with minimal disruption to the business, and the site was left clean and tidy every day.",
    ],
    name: "Michael Taylor",
    role: "Business Owner",
  },
  {
    quote: [
      "Professionalism, reliability, and excellence define ERS Energy Ltd's work. They transformed our roof with skill and precision, and their solar PV solutions are top-notch.",
    ],
    name: "Olivia White",
    role: "Property Manager",
  },
];
