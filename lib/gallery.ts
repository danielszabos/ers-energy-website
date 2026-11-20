// Gallery page projects. Written only from ERS's own social media posts about
// each job and from what the photos show; nothing else is assumed. Photos live
// in /public/projects/ERS Projects/{folder}/.

export type GalleryPhoto = {
  file: string;
  /** Also the photo's caption under the write-up and when opened full size. */
  alt: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
};

/** What the gallery's filter buttons sort projects by. */
export type GalleryCategory = "solar" | "roofing" | "battery";

/** The filter buttons, in order. */
export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "solar", label: "Solar PV" },
  { id: "roofing", label: "Roofing" },
  { id: "battery", label: "Battery storage" },
];

export type GalleryProject = {
  id: string;
  name: string;
  subtitle?: string;
  location?: string;
  folder: string;
  /** The photo across the project's strip, and the first one shown when it's opened. */
  hero: { file: string; position?: string };
  figures?: { value: string; unit?: string; label: string }[];
  services: string[];
  /** Which filter buttons it shows under: the main kinds of work in `services`. */
  categories: GalleryCategory[];
  description: string[];
  /** The rest of the project's photos, stepped through with the arrows once it's open. */
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
    categories: ["roofing", "solar"],
    description: [
      "A new roof and a solar installation on the Alan Kelly Stand at Preston North End's Deepdale stadium.",
      "The photos were taken from inside the stand while the work was under way. Netting is rigged beneath the roof, and an operative works at the roof edge from a cherry picker, high above the seats.",
    ],
    hero: { file: "2.png", position: "50% 72%" },
    photos: [
      {
        file: "1.png",
        alt: "Netting rigged beneath the stand roof, below the roof sheets and steelwork",
      },
    ],
  },
  {
    id: "advanced-technologies",
    name: "Advanced Technologies",
    location: "Nelson",
    folder: "Advanced Technologies Nelson",
    figures: [
      { value: "557", unit: "kW", label: "Solar array" },
      { value: "4,500", unit: "m²", label: "Roof over-clad" },
    ],
    services: ["Roof over-cladding", "Solar PV", "EV charging", "LED lighting"],
    categories: ["roofing", "solar"],
    description: [
      "A new roof and a 557kW solar array for Advanced Technologies in Nelson, along with six EV chargers and all-new LED lighting for the factory.",
      "The ageing roof came first. ERS over-clad it, fitting 4,500m² of new roof sheets over the existing roof, and with that done, work began on the solar array.",
      "The photos show the array going in: long rows of panels laid out across the new light-grey profiled roof, with edge protection around the roof and the team at work beyond.",
    ],
    hero: { file: "5.jpg", position: "50% 55%" },
    photos: [
      {
        file: "1.jpg",
        alt: "Rows of panels running along the new light-grey profiled roof",
      },
      {
        file: "3.jpg",
        alt: "An installer crossing the roof between rows of panels",
        position: "50% 40%",
      },
      {
        file: "2.jpg",
        alt: "A block of panels on the new roof, with the cabling laid out beneath it",
      },
      {
        file: "4.jpg",
        alt: "Long rows of panels across the roof, with trees and fields beyond",
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
    categories: ["solar", "battery"],
    description: [
      "A 280kW solar array with a 50kW battery solution at Trafford Bus Station.",
      "The photos show the plant room behind it. Three red inverters and three SolaX units line the walls behind a mesh partition, with a row of floor-standing battery modules beneath them. The isolators, and a generation meter for each of the three PV inverters, are mounted on steel trunking, and the cabling runs neatly up the walls.",
    ],
    hero: { file: "2.jpg", position: "50% 58%" },
    photos: [
      {
        file: "4.jpg",
        alt: "Generation meters labelled for PV inverters 1, 2 and 3, on steel trunking",
        position: "50% 40%",
      },
      {
        file: "1.jpg",
        alt: "Three red inverters, with cabling running down to steel trunking and isolators",
      },
      {
        file: "3.jpg",
        alt: "Isolators mounted beneath the inverters",
      },
    ],
  },
  {
    id: "caldeira-cushion-factory",
    name: "Caldeira Cushion Factory",
    location: "Knowsley",
    folder: "CALDEIRA CUSHION FACTORY",
    figures: [{ value: "6,000", unit: "m²", label: "New roof" }],
    services: ["Commercial roofing"],
    categories: ["roofing"],
    description: [
      "6,000m² of new roof for the Caldeira cushion factory in Knowsley.",
      "A crane lifted packs of new roof panels up to the team, and the new light-grey sheets went on in place of the old blue profiled roof, with edge protection along the working areas. Inside, netting was rigged beneath the roof while the work went on overhead.",
      "With the roof done, the plan was to move on to solar PV.",
    ],
    hero: { file: "1.jpg", position: "50% 58%" },
    photos: [
      {
        file: "3.jpg",
        alt: "New light-grey roof sheets alongside the old blue profiled roof",
      },
      {
        file: "2.jpg",
        alt: "Insulation laid out across the old blue roof, with a roofer at work beyond",
      },
      {
        file: "4.jpg",
        alt: "Inside the factory, with netting rigged beneath the roof",
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
    categories: ["solar"],
    description: [
      "A 280kW solar array across the roofs of the farm's buildings in the Midlands.",
      "The panels are fitted to green profiled metal roofs, set out around the existing rooflights. Edge protection ran along the roofs while the team worked, with polytunnels stretching away behind.",
    ],
    hero: { file: "2.png", position: "50% 45%" },
    photos: [
      {
        file: "4.png",
        alt: "An installer working along the top of the array, behind edge protection",
        position: "30% 50%",
      },
      {
        file: "3.png",
        alt: "Rows of panels fitted around the existing rooflights",
      },
    ],
  },
  {
    id: "francos-bakery",
    name: "Francos Bakery",
    location: "Bolton",
    folder: "Francos Bakery Bolton",
    figures: [{ value: "1,800", unit: "m²", label: "Asbestos roof over-clad" }],
    services: ["Asbestos roof over-cladding"],
    categories: ["roofing"],
    description: [
      "1,800m² of asbestos roof over-clad at Francos Bakery in Bolton. Over-cladding fits a new roof over the old asbestos sheets, sealing them in place instead of stripping them off.",
      "The photos show the new roof going on. Insulation was laid across the old corrugated sheets between spacer rails, and the new light-grey profiled sheets were fixed over the top, with safety netting and scaffolding in place while the team worked.",
    ],
    hero: { file: "4.jpg", position: "50% 40%" },
    photos: [
      {
        file: "1.jpg",
        alt: "New roof sheets alongside the old roof, with safety netting laid over the old sheets",
      },
      {
        file: "2.jpg",
        alt: "New sheets going on over insulation laid across the old asbestos roof",
      },
      {
        file: "3.jpg",
        alt: "A wide run of finished light-grey roof sheets",
      },
      {
        file: "5.jpg",
        alt: "Finished roof sheets running down the slope",
      },
    ],
  },
  {
    id: "mears-carpets",
    name: "Mears Carpets",
    location: "Preston",
    folder: "Mears Carpets Preston",
    figures: [{ value: "100", unit: "kW", label: "Solar array" }],
    services: ["Solar PV"],
    categories: ["solar"],
    description: [
      "A 100kW solar array for Mears Carpets in Preston.",
      "The photos were taken as the job neared completion, with the sun going down. Long rows of panels run along the profiled metal roof, with scaffolding around the roof edge and a boarded walkway beside the gutter.",
    ],
    hero: { file: "4.jpg", position: "50% 55%" },
    photos: [
      {
        file: "1.jpg",
        alt: "Sunset over the roof, with rows of panels behind the scaffold edge protection",
      },
      {
        file: "5.jpg",
        alt: "Rows of panels running the length of the roof beside the gutter",
      },
      {
        file: "3.jpg",
        alt: "The boarded scaffold walkway along the roof edge, beside the array",
      },
      {
        file: "2.jpg",
        alt: "Rows of panels beyond the edge protection, seen across the roof",
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
    categories: ["roofing", "solar"],
    description: [
      "A new office roof for Pure Utilities in Preston, combined with a 55kW in-roof solar array. In-roof means the panels sit within the roof itself, in place of the roof covering, rather than being fixed on top.",
      "The photos show the roof coming together: breathable membrane and battens across the pitches, black in-roof mounting trays set into the slopes, and the dark roof covering going on around them, with scaffolding around the whole building. A glazed roof lantern sits on the flat section between the pitches.",
    ],
    hero: { file: "2.jpg", position: "50% 60%" },
    photos: [
      {
        file: "3.jpg",
        alt: "The office building wrapped in scaffolding during the new roof",
        position: "50% 62%",
      },
      {
        file: "4.jpg",
        alt: "The dark roof covering going on around the in-roof solar trays",
      },
      {
        file: "1.jpg",
        alt: "Breathable membrane and battens across the roof pitches",
      },
    ],
  },
  {
    id: "middleton-bus-station",
    name: "Middleton Bus Station",
    location: "Middleton",
    folder: "Middleton Bus Station",
    figures: [
      { value: "49.7", unit: "kW", label: "Solar array" },
      { value: "10.6", unit: "kW", label: "Battery storage" },
    ],
    services: ["Solar PV", "Battery storage"],
    categories: ["solar", "battery"],
    description: [
      "A 49.7kW solar array with a 10.6kW battery at Middleton Bus Station.",
      "The photos show the electrical installation as the job neared completion. The inverter is mounted on the block wall above a row of isolators on steel trunking, beside a panel of meters, with the cabling running up the wall on cable tray towards the roof.",
    ],
    hero: { file: "4.jpg", position: "50% 50%" },
    photos: [
      {
        file: "2.jpg",
        alt: "The inverter and meter panel, with the cabling running up towards the roof",
      },
      {
        file: "1.jpg",
        alt: "The inverter above a row of isolators on steel trunking",
      },
      {
        file: "3.jpg",
        alt: "The steel trusses carrying the roof overhead",
      },
    ],
  },
  {
    id: "tile-merchants",
    name: "Tile Merchants",
    location: "Astley, Greater Manchester",
    folder: "Tile Merchants Astley",
    figures: [
      { value: "500", unit: "m", label: "Laps treated" },
      { value: "5,000", label: "Fixings replaced" },
    ],
    services: ["Cut edge corrosion treatment", "Replacement fixings"],
    categories: ["roofing"],
    description: [
      "Cut edge corrosion treatment to 500m of laps at Tile Merchants in Astley, along with 5,000 replacement fixings, to give the roof another 10 years of life.",
      "Cut edge corrosion is rust that starts at the cut edges of metal roof sheets, where they overlap, and creeps back under the coating. Close up, the old laps were rusting and staining the roof around them. Each one was treated and sealed with a grey coating, which now runs in bands across the roof.",
    ],
    hero: { file: "4.jpg", position: "50% 50%" },
    photos: [
      {
        file: "2.jpg",
        alt: "Close-up of rusting cut edges where the roof sheets overlap",
      },
      {
        file: "3.jpg",
        alt: "A lap after treatment, sealed with a grey coating",
      },
      {
        file: "5.jpg",
        alt: "A treated lap running down the roof between the rooflights",
      },
      {
        file: "1.jpg",
        alt: "Looking across the roof, with rooflights set between the sheets",
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
    categories: ["solar"],
    description: [
      "A 120kW solar array for Global Moto in Coventry, laid out in long rows along the building's profiled metal roof.",
      "To avoid disrupting the business, ERS commissioned the system at night. Inside, the plant room is set out neatly, with a Solis inverter, isolators and PV generation meters mounted on steel trunking.",
    ],
    hero: { file: "4.jpg", position: "50% 60%" },
    photos: [
      {
        file: "2.jpg",
        alt: "Rows of panels along the profiled metal roof, with edge protection along the side",
      },
      {
        file: "1.jpg",
        alt: "Close-up of the panels under a clear blue sky",
      },
      {
        file: "5.jpg",
        alt: "The plant room: a Solis inverter, isolators and PV generation meters on steel trunking",
      },
    ],
  },
  {
    id: "warwick-council",
    name: "Warwick Council",
    folder: "Warwick Council 10.2018",
    services: ["Windows", "Roofing", "Balconies"],
    categories: ["roofing"],
    description: [
      "New windows, a new roof and new balconies on a building for Warwick Council.",
      "The photos are from the start of the job, with the brick building wrapped in scaffolding along its full length, right up to roof level.",
    ],
    hero: { file: "5.jpg", position: "50% 45%" },
    photos: [
      {
        file: "1.jpg",
        alt: "Scaffolding up to roof level at the start of the job",
      },
      {
        file: "2.jpg",
        alt: "Scaffolding along the side of the building, on every level",
      },
    ],
  },
  {
    id: "sturge-industries",
    name: "Sturge Industries",
    folder: "Sturge Industries",
    figures: [{ value: "170", unit: "kW", label: "Solar array" }],
    services: ["Solar PV"],
    categories: ["solar"],
    description: [
      "A 170kW solar array for Sturge Industries, fitted in long rows across a light-grey profiled metal roof.",
      "The photos follow the job from the first panels and cable runs going down to the finished rows, with cable tray carrying the wiring along the roof. Commissioning and a witness test of the system were the final steps.",
    ],
    hero: { file: "4.jpg", position: "50% 45%" },
    photos: [
      {
        file: "2.jpg",
        alt: "The finished rows of panels across the roof",
        position: "50% 60%",
      },
      {
        file: "1.jpg",
        alt: "The first panels going down, with cable runs laid across the roof",
      },
      {
        file: "3.jpg",
        alt: "Cable tray carrying the wiring along the roof beside the panels",
      },
    ],
  },
  {
    id: "grimsby-gutters",
    name: "Gutter Replacement",
    location: "Grimsby",
    folder: "Grimsby Gutters",
    figures: [{ value: "2", unit: "days", label: "To fit the new gutters" }],
    services: ["Gutter replacement"],
    categories: ["roofing"],
    description: [
      "All-new gutters for a building in Grimsby, fitted in two days. Other contractors had been coating the old gutters for years; ERS replaced them instead.",
      "The gutters run between the building's roofs, with a curved roof on one side and a corrugated roof with rooflights on the other.",
    ],
    hero: { file: "3.jpg", position: "50% 55%" },
    photos: [
      {
        file: "2.jpg",
        alt: "Looking along a gutter between the curved roof and the corrugated roof, above the yard",
      },
      {
        file: "1.jpg",
        alt: "Sunlight reflected in the water along a gutter between two roofs",
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
    categories: ["solar"],
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
      },
      {
        file: "3.jpg",
        alt: "Mounting frames weighted with ballast blocks, before the panels went on",
      },
      {
        file: "1.jpg",
        alt: "Two banks of panels either side of a central gap on the flat roof",
      },
    ],
  },
];
