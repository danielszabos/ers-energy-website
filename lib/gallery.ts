// Gallery page projects. Written only from ERS's own social media posts about
// each job and from what the photos show; nothing else is assumed. Photos live
// in /public/projects/ERS Projects/{folder}/.

export type GalleryPhoto = {
  file: string;
  /** Also the caption when the photo is opened full size. */
  alt: string;
  /** wide: full width, 16:9. square / tall (3:4): half width. */
  shape: "wide" | "square" | "tall";
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
};

export type GalleryProject = {
  id: string;
  name: string;
  subtitle?: string;
  location?: string;
  folder: string;
  /** The photo across the project's strip, cropped to a thin band. */
  hero: { file: string; position?: string };
  figures?: { value: string; unit?: string; label: string }[];
  services: string[];
  description: string[];
  /** The rest of the project's photos, shown when the strip opens. */
  photos: GalleryPhoto[];
};

export const galleryProjects: GalleryProject[] = [
  {
    id: "preston-north-end",
    name: "Preston North End Football Club",
    subtitle: "Alan Kelly Stand",
    location: "Deepdale, Preston",
    folder: "Preston North End football club",
    services: ["Roofing", "Solar PV"],
    description: [
      "A new roof and a solar installation on the Alan Kelly Stand at Preston North End's Deepdale stadium.",
      "The photos were taken from inside the stand while the work was under way. Netting is rigged beneath the roof, and an operative works at the roof edge from a cherry picker, high above the seats.",
    ],
    hero: { file: "2.png", position: "50% 72%" },
    photos: [
      {
        file: "1.png",
        alt: "Netting rigged beneath the stand roof, below the roof sheets and steelwork",
        shape: "wide",
      },
    ],
  },
  {
    id: "trafford-bus-station",
    name: "Trafford Bus Station",
    location: "Trafford",
    folder: "Trafford Bus Station",
    figures: [
      { value: "280", unit: "kW", label: "Solar array" },
      { value: "50", unit: "kW", label: "Battery storage" },
    ],
    services: ["Solar PV", "Battery storage"],
    description: [
      "A 280kW solar array with a 50kW battery solution at Trafford Bus Station.",
      "The photos show the plant room behind it. Three red inverters and three SolaX units line the walls behind a mesh partition, with a row of floor-standing battery modules beneath them. The isolators, and a generation meter for each of the three PV inverters, are mounted on steel trunking, and the cabling runs neatly up the walls.",
    ],
    hero: { file: "2.jpg", position: "50% 58%" },
    photos: [
      {
        file: "4.jpg",
        alt: "Generation meters labelled for PV inverters 1, 2 and 3, on steel trunking",
        shape: "wide",
        position: "50% 40%",
      },
      {
        file: "1.jpg",
        alt: "Three red inverters, with cabling running down to steel trunking and isolators",
        shape: "square",
      },
      {
        file: "3.jpg",
        alt: "Isolators mounted beneath the inverters",
        shape: "square",
      },
    ],
  },
  {
    id: "caldeira-cushion-factory",
    name: "Caldeira Cushion Factory",
    location: "Knowsley",
    folder: "CALDEIRA CUSHION FACTORY",
    figures: [{ value: "6,000", unit: "m", label: "Of roof" }],
    services: ["Commercial roofing"],
    description: [
      "6,000m of new roof for the Caldeira cushion factory in Knowsley.",
      "A crane lifted packs of new roof panels up to the team, and the new light-grey sheets went on in place of the old blue profiled roof, with edge protection along the working areas. Inside, netting was rigged beneath the roof while the work went on overhead.",
      "With the roof done, the plan was to move on to solar PV.",
    ],
    hero: { file: "1.jpg", position: "50% 58%" },
    photos: [
      {
        file: "3.jpg",
        alt: "New light-grey roof sheets alongside the old blue profiled roof",
        shape: "tall",
      },
      {
        file: "2.jpg",
        alt: "Insulation laid out across the old blue roof, with a roofer at work beyond",
        shape: "tall",
      },
      {
        file: "4.jpg",
        alt: "Inside the factory, with netting rigged beneath the roof",
        shape: "wide",
        position: "50% 35%",
      },
    ],
  },
  {
    id: "littlewood-farm",
    name: "Littlewood Farm",
    location: "The Midlands",
    folder: "Littlewood Farm Midlands 09.2023",
    figures: [{ value: "280", unit: "kW", label: "Solar array" }],
    services: ["Solar PV"],
    description: [
      "A 280kW solar array across the roofs of the farm's buildings in the Midlands.",
      "The panels are fitted to green profiled metal roofs, set out around the existing rooflights. Edge protection ran along the roofs while the team worked, with polytunnels stretching away behind.",
    ],
    hero: { file: "2.png", position: "50% 45%" },
    photos: [
      {
        file: "4.png",
        alt: "An installer working along the top of the array, behind edge protection",
        shape: "square",
        position: "30% 50%",
      },
      {
        file: "3.png",
        alt: "Rows of panels fitted around the existing rooflights",
        shape: "square",
      },
    ],
  },
  {
    id: "pure-utilities",
    name: "Pure Utilities",
    location: "Preston",
    folder: "Pure Utilities",
    figures: [{ value: "55", unit: "kW", label: "In-roof solar array" }],
    services: ["Roofing", "In-roof solar PV"],
    description: [
      "A new office roof for Pure Utilities in Preston, combined with a 55kW in-roof solar array. In-roof means the panels sit within the roof itself, in place of the roof covering, rather than being fixed on top.",
      "The photos show the roof coming together: breathable membrane and battens across the pitches, black in-roof mounting trays set into the slopes, and the dark roof covering going on around them, with scaffolding around the whole building. A glazed roof lantern sits on the flat section between the pitches.",
    ],
    hero: { file: "2.jpg", position: "50% 60%" },
    photos: [
      {
        file: "3.jpg",
        alt: "The office building wrapped in scaffolding during the new roof",
        shape: "wide",
        position: "50% 62%",
      },
      {
        file: "4.jpg",
        alt: "The dark roof covering going on around the in-roof solar trays",
        shape: "square",
      },
      {
        file: "1.jpg",
        alt: "Breathable membrane and battens across the roof pitches",
        shape: "square",
      },
    ],
  },
  {
    id: "global-moto",
    name: "Global Moto",
    location: "Coventry",
    folder: "Global Moto Coventry",
    figures: [{ value: "120", unit: "kW", label: "Solar array" }],
    services: ["Solar PV"],
    description: [
      "A 120kW solar array for Global Moto in Coventry, laid out in long rows along the building's profiled metal roof.",
      "To avoid disrupting the business, ERS commissioned the system at night. Inside, the plant room is set out neatly, with a Solis inverter, isolators and PV generation meters mounted on steel trunking.",
    ],
    hero: { file: "4.jpg", position: "50% 60%" },
    photos: [
      {
        file: "2.jpg",
        alt: "Rows of panels along the profiled metal roof, with edge protection along the side",
        shape: "wide",
      },
      {
        file: "1.jpg",
        alt: "Close-up of the panels under a clear blue sky",
        shape: "square",
      },
      {
        file: "5.jpg",
        alt: "The plant room: a Solis inverter, isolators and PV generation meters on steel trunking",
        shape: "square",
      },
    ],
  },
  {
    id: "warwick-council",
    name: "Warwick Council",
    folder: "Warwick Council 10.2018",
    services: ["Windows", "Roofing", "Balconies"],
    description: [
      "New windows, a new roof and new balconies on a building for Warwick Council.",
      "The photos are from the start of the job, with the brick building wrapped in scaffolding along its full length, right up to roof level.",
    ],
    hero: { file: "5.jpg", position: "50% 45%" },
    photos: [
      {
        file: "1.jpg",
        alt: "Scaffolding up to roof level at the start of the job",
        shape: "tall",
      },
      {
        file: "2.jpg",
        alt: "Scaffolding along the side of the building, on every level",
        shape: "tall",
      },
    ],
  },
  {
    id: "sturge-industries",
    name: "Sturge Industries",
    folder: "Sturge Industries",
    figures: [{ value: "170", unit: "kW", label: "Solar array" }],
    services: ["Solar PV"],
    description: [
      "A 170kW solar array for Sturge Industries, fitted in long rows across a light-grey profiled metal roof.",
      "The photos follow the job from the first panels and cable runs going down to the finished rows, with cable tray carrying the wiring along the roof. Commissioning and a witness test of the system were the final steps.",
    ],
    hero: { file: "4.jpg", position: "50% 45%" },
    photos: [
      {
        file: "2.jpg",
        alt: "The finished rows of panels across the roof",
        shape: "wide",
        position: "50% 60%",
      },
      {
        file: "1.jpg",
        alt: "The first panels going down, with cable runs laid across the roof",
        shape: "square",
      },
      {
        file: "3.jpg",
        alt: "Cable tray carrying the wiring along the roof beside the panels",
        shape: "square",
      },
    ],
  },
  {
    id: "bob-jackson",
    name: "Bob Jackson",
    location: "Bolton",
    folder: "Bob Jackson",
    figures: [
      { value: "9.6", unit: "kW", label: "Solar array" },
      { value: "24", label: "Panels" },
    ],
    services: ["Domestic solar PV"],
    description: [
      "A 24-panel, 9.6kW solar array on a house in Bolton.",
      "It was the second house ERS fitted in Bolton, after a recommendation from the neighbour, whose system ERS had installed the year before.",
      "The panels sit in rows on the flat roof, on mounting frames weighted down with ballast blocks, with open fields and hills all around.",
    ],
    hero: { file: "4.jpg", position: "50% 30%" },
    photos: [
      {
        file: "2.jpg",
        alt: "Rows of panels along the flat roof",
        shape: "wide",
      },
      {
        file: "3.jpg",
        alt: "Mounting frames weighted with ballast blocks, before the panels went on",
        shape: "square",
      },
      {
        file: "1.jpg",
        alt: "Two banks of panels either side of a central gap on the flat roof",
        shape: "square",
      },
    ],
  },
];
