// ERS projects on the About page map, one circle per place, sized by how many
// projects are there. Places are only merged when they're the same town (Cheetham
// and Dale Street are both in Manchester); neighbouring towns like Eccles or
// Astley keep their own circle. 110 projects in 58 places.
//
// Coordinates are each town's centre, or the site where it's known. Littlewood
// Farm isn't on the map: its only location is "the Midlands".
// To add a project, add it to its place's list (or add a new place); the
// circle sizes and totals update themselves.

export type ProjectPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  projects: string[];
  note?: string;
  base?: boolean;
  /** Writes the name beside the circle once zoomed in, to help people find their way. */
  label?: "left" | "right" | "above" | "below";
};

/**
 * Circle diameter in px: its area grows with the number of projects. Also
 * decides when nearby circles merge on the map (see ProjectMap.tsx).
 */
export function circleSize(count: number) {
  return 8 + 3.5 * Math.sqrt(Math.max(count, 1) - 1);
}

export const projectPlaces: ProjectPlace[] = [
  {
    // Includes Cheetham and Dale Street.
    id: "manchester",
    name: "Manchester",
    label: "right",
    lat: 53.4794,
    lon: -2.2453,
    projects: [
      "Queens Road Bus Station",
      "Browns Print",
      "Manchester asbestos overclad and wall cladding",
      "Kacoo Fashion",
      "Manchester 350 kW solar",
      "David Luke",
      "Emerge Recycling",
      "One Stop Car Shop",
      "Manchester Council",
      "Gym28",
      "Revolution Property",
      "Tontarelli Group",
      "Matlock Place balconies",
      "Boohoo head office",
      "Allied Mills",
      "City Centre Hotel",
      "ITV Coronation Street",
      "Construction Signs",
      "Wellington Mill (PLT)",
      "Manchester 70 kW",
    ],
  },
  {
    id: "leigh",
    name: "Leigh",
    lat: 53.4975,
    lon: -2.516,
    note: "Our HQ", base: true,
    projects: [
      "Leigh Bus Station",
      "The Tree Bespoke Carpentry",
      "Leigh Plumbing Merchants",
      "Leigh asbestos overclad",
      "Buckle Invest",
      "Ford Garage",
      "WJ Structures",
      "Cotton Mill",
      "Mill in Leigh",
    ],
  },
  {
    id: "preston",
    name: "Preston",
    label: "left",
    lat: 53.7632,
    lon: -2.7031,
    projects: [
      "Preston North End Football Club",
      "Pure Utilities",
      "Mears Carpets",
      "Mortgage Solution Centre",
      "BRK Enterprises",
    ],
  },
  {
    id: "bolton",
    name: "Bolton",
    lat: 53.578,
    lon: -2.429,
    projects: [
      "Ross Roofing",
      "Francos Bakery",
      "Sherwin Williams",
      "Zakariyya Masjid Mosque",
    ],
  },
  {
    // Trafford Park; Trafford Bus Station is placed here too.
    id: "trafford",
    name: "Trafford",
    lat: 53.466,
    lon: -2.322,
    projects: ["Trafford Bus Station", "LUR", "The DOT Company", "J Heebink"],
  },
  {
    // Astley near Tyldesley, not Manchester city.
    id: "astley",
    name: "Astley",
    lat: 53.4997,
    lon: -2.4474,
    projects: ["JBD Distributions Ltd", "Tile Merchants"],
  },
  {
    id: "atherton",
    name: "Atherton",
    lat: 53.523,
    lon: -2.493,
    projects: ["ENA Mill", "Fast Fit"],
  },
  {
    // Placed at Bedford; covers Bedford and Bedfordshire.
    id: "bedfordshire",
    name: "Bedfordshire",
    lat: 52.136,
    lon: -0.467,
    projects: ["Bedford solar", "Perfect Aquatics"],
  },
  {
    id: "blackpool",
    name: "Blackpool",
    lat: 53.817,
    lon: -3.036,
    projects: ["AJH Plant Hire", "Blackpool College"],
  },
  {
    id: "burnley",
    name: "Burnley",
    lat: 53.789,
    lon: -2.248,
    projects: ["Spring Garden Mill", "Burnley Mill"],
  },
  {
    id: "chester",
    name: "Chester",
    label: "right",
    lat: 53.193,
    lon: -2.893,
    projects: ["Ungerer Ltd", "Chester overclad"],
  },
  {
    id: "coventry",
    name: "Coventry",
    lat: 52.4068,
    lon: -1.5197,
    projects: ["Global Moto", "Coventry roof treatment"],
  },
  {
    id: "halifax",
    name: "Halifax",
    lat: 53.725,
    lon: -1.863,
    projects: ["Halifax re-roof", "Northowram Methodist Church"],
  },
  {
    id: "haydock",
    name: "Haydock",
    lat: 53.467,
    lon: -2.683,
    projects: ["European Furniture Group", "Aimia Foods"],
  },
  {
    id: "hull",
    name: "Hull",
    lat: 53.745,
    lon: -0.336,
    projects: ["Hull gutters", "Hull overclad"],
  },
  {
    id: "leeds",
    name: "Leeds",
    label: "above",
    lat: 53.7997,
    lon: -1.5492,
    projects: ["Simply Moving and Storage", "Leeds wall cladding"],
  },
  {
    id: "leicester",
    name: "Leicester",
    lat: 52.6369,
    lon: -1.1398,
    projects: ["ADS Laser Cutting", "St Margaret's Bus Station"],
  },
  {
    id: "liverpool",
    name: "Liverpool",
    label: "below",
    lat: 53.4084,
    lon: -2.9916,
    projects: ["Mark Powell's Barber Shop", "Liverpool Docks"],
  },
  {
    id: "skelmersdale",
    name: "Skelmersdale",
    lat: 53.55,
    lon: -2.776,
    projects: ["Trelleborg International", "Greenhey Marine"],
  },
  {
    id: "st-helens",
    name: "St Helens",
    lat: 53.454,
    lon: -2.737,
    projects: ["St Helens roof works", "S&S Motors"],
  },
  {
    id: "blackburn",
    name: "Blackburn",
    lat: 53.748,
    lon: -2.484,
    projects: ["St Wilfrid's C of E Academy"],
  },
  {
    id: "bradford",
    name: "Bradford",
    lat: 53.795,
    lon: -1.759,
    projects: ["Westminster Primary School"],
  },
  {
    id: "brentford",
    name: "Brentford",
    lat: 51.486,
    lon: -0.309,
    projects: ["Kia"],
  },
  {
    id: "carrington",
    name: "Carrington",
    lat: 53.433,
    lon: -2.39,
    projects: ["Saica Paper Mill"],
  },
  {
    id: "eccles",
    name: "Eccles",
    lat: 53.483,
    lon: -2.334,
    projects: ["Realco Equipment Ltd"],
  },
  {
    id: "ellesmere-port",
    name: "Ellesmere Port",
    lat: 53.2786,
    lon: -2.9017,
    projects: ["Regatta"],
  },
  {
    id: "garforth",
    name: "Garforth",
    lat: 53.793,
    lon: -1.388,
    projects: ["Garforth store"],
  },
  {
    id: "grimsby",
    name: "Grimsby",
    lat: 53.567,
    lon: -0.08,
    projects: ["Grimsby gutters"],
  },
  {
    id: "harrow",
    name: "Harrow",
    lat: 51.58,
    lon: -0.341,
    projects: ["Magnet"],
  },
  {
    id: "haslingden",
    name: "Haslingden",
    lat: 53.705,
    lon: -2.328,
    projects: ["Haslingden Mill"],
  },
  {
    // Approximate: the Hodder valley, Ribble Valley.
    id: "hodder",
    name: "Hodder",
    lat: 53.86,
    lon: -2.46,
    projects: ["United Utilities wastewater treatment plant"],
  },
  {
    id: "horwich",
    name: "Horwich",
    lat: 53.601,
    lon: -2.552,
    projects: ["United Utilities"],
  },
  {
    id: "huddersfield",
    name: "Huddersfield",
    lat: 53.645,
    lon: -1.7798,
    projects: ["BM Packaging"],
  },
  {
    id: "hyde",
    name: "Hyde",
    lat: 53.4517,
    lon: -2.0794,
    projects: ["Hyde Bus Station"],
  },
  {
    id: "irlam",
    name: "Irlam",
    lat: 53.443,
    lon: -2.422,
    projects: ["Animals In Distress"],
  },
  {
    id: "kearsley",
    name: "Kearsley",
    lat: 53.544,
    lon: -2.375,
    projects: ["Costcutter"],
  },
  {
    id: "knowsley",
    name: "Knowsley",
    lat: 53.4549,
    lon: -2.8529,
    projects: ["Caldeira Cushion Factory"],
  },
  {
    // Approximate: the middle of the National Park.
    id: "lake-district",
    name: "Lake District",
    label: "right",
    lat: 54.46,
    lon: -3.09,
    projects: ["Lake District farm"],
  },
  {
    id: "little-hulton",
    name: "Little Hulton",
    lat: 53.531,
    lon: -2.418,
    projects: ["Autocraze"],
  },
  {
    id: "littleborough",
    name: "Littleborough",
    lat: 53.643,
    lon: -2.095,
    projects: ["Animals In Distress"],
  },
  {
    id: "livingston",
    name: "Livingston",
    lat: 55.903,
    lon: -3.522,
    projects: ["Livingston dilapidations"],
  },
  {
    id: "middleton",
    name: "Middleton",
    lat: 53.5524,
    lon: -2.195,
    projects: ["Middleton Bus Station"],
  },
  {
    id: "nelson",
    name: "Nelson",
    lat: 53.835,
    lon: -2.218,
    projects: ["Advanced Technologies"],
  },
  {
    id: "rainford",
    name: "Rainford",
    lat: 53.504,
    lon: -2.788,
    projects: ["Communications Plus"],
  },
  {
    // Arrow Mill, Queensway.
    id: "rochdale",
    name: "Rochdale",
    lat: 53.595,
    lon: -2.175,
    projects: ["Arrow Mill"],
  },
  {
    // Placed at Hazel Grove, where the job was.
    id: "stockport",
    name: "Stockport",
    lat: 53.377,
    lon: -2.111,
    projects: ["Hazel Grove overclad"],
  },
  {
    id: "stoke",
    name: "Stoke",
    label: "right",
    lat: 53.003,
    lon: -2.179,
    projects: ["GDHA / Glen Dimplex"],
  },
  {
    // North of Cardiff.
    id: "taff-s-well",
    name: "Taff's Well",
    lat: 51.5426,
    lon: -3.2655,
    projects: ["Transport for Wales"],
  },
  {
    id: "walsall",
    name: "Walsall",
    lat: 52.586,
    lon: -1.982,
    projects: ["Subway"],
  },
  {
    id: "warwick",
    name: "Warwick",
    lat: 52.282,
    lon: -1.585,
    projects: ["Warwick Council"],
  },
  {
    id: "watford",
    name: "Watford",
    lat: 51.656,
    lon: -0.396,
    projects: ["Watford"],
  },
  {
    id: "wellingborough",
    name: "Wellingborough",
    lat: 52.3021,
    lon: -0.6939,
    projects: ["EFCO"],
  },
  {
    id: "west-bromwich",
    name: "West Bromwich",
    lat: 52.5187,
    lon: -1.9945,
    projects: ["Highspeed Engineering"],
  },
  {
    id: "westhoughton",
    name: "Westhoughton",
    lat: 53.549,
    lon: -2.524,
    projects: ["Bolton Steel Structures"],
  },
  {
    id: "whaley-bridge",
    name: "Whaley Bridge",
    lat: 53.33,
    lon: -1.984,
    projects: ["Toddbrook Farm"],
  },
  {
    id: "widnes",
    name: "Widnes",
    lat: 53.361,
    lon: -2.733,
    projects: ["Collins Aerospace"],
  },
  {
    id: "wigan",
    name: "Wigan",
    lat: 53.545,
    lon: -2.632,
    projects: ["Saica Pack"],
  },
  {
    id: "worcester",
    name: "Worcester",
    lat: 52.192,
    lon: -2.22,
    projects: ["Npower head office"],
  },
];
