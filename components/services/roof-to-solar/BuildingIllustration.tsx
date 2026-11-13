// Flat illustration of an industrial unit for the roof-to-solar section.
// The markup is the finished scene (refurbished roof, panels, night, lit
// windows), which is what visitors see without JS or with reduced motion.
// RoofToSolarScene rewinds it to the worn roof and plays it back on scroll,
// targeting elements by their data-scene names.

// Geometry in viewBox units (1000 × 625). The building uses a simple oblique
// projection: the front wall is a true rectangle and depth runs up and right.
const GROUND = 520;
const WALL = { left: 230, right: 730, eave: 330 };
const DEPTH = { x: 110, y: 64 };
const RIDGE_RISE = 46;
const SLOPE = { x: DEPTH.x / 2, y: -(DEPTH.y / 2 + RIDGE_RISE) };
const ROOF_LENGTH = WALL.right - WALL.left;

type Point = [number, number];

const round = (n: number) => Math.round(n * 10) / 10;
const toPoints = (pts: Point[]) => pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");

/** Point on the front roof slope: `u` along the eave, `t` from eave (0) to ridge (1). */
function roof(u: number, t: number): Point {
  return [WALL.left + u + SLOPE.x * t, WALL.eave + SLOPE.y * t];
}

function roofQuad(u0: number, u1: number, t0: number, t1: number) {
  return toPoints([roof(u0, t0), roof(u1, t0), roof(u1, t1), roof(u0, t1)]);
}

function roofLine(u0: number, t0: number, u1: number, t1: number) {
  const [x0, y0] = roof(u0, t0);
  const [x1, y1] = roof(u1, t1);
  return `M${round(x0)} ${round(y0)}L${round(x1)} ${round(y1)}`;
}

// Seeded so the weathering and stars are identical on every render.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Roof sheets and their profile ribs.
const SHEETS = 10;
const SHEET_WIDTH = ROOF_LENGTH / SHEETS;
const RIB_SPACING = 12.5;

const ribs = Array.from({ length: ROOF_LENGTH / RIB_SPACING - 1 }, (_, i) => {
  const u = (i + 1) * RIB_SPACING;
  return roofLine(u, 0, u, 1);
}).join("");

const sheetJoints = Array.from({ length: SHEETS - 1 }, (_, i) => {
  const u = (i + 1) * SHEET_WIDTH;
  return roofLine(u, 0, u, 1);
}).join("");

/** Rust run-off: wide where it starts, narrowing as it runs down the slope. */
function streak(u: number, width: number, top: number, bottom: number) {
  const inset = width * 0.32;
  return toPoints([roof(u, top), roof(u + width, top), roof(u + width - inset, bottom), roof(u + inset, bottom)]);
}

const wornSheets = (() => {
  const rand = seeded(11);
  return Array.from({ length: SHEETS }, (_, i) => {
    const u0 = i * SHEET_WIDTH;
    const u1 = u0 + SHEET_WIDTH;
    const streaks = Array.from({ length: 1 + Math.floor(rand() * 2) }, () => {
      const width = 7 + rand() * 9;
      const u = u0 + 3 + rand() * (SHEET_WIDTH - width - 6);
      const top = 0.55 + rand() * 0.4;
      return {
        shape: streak(u, width, top, Math.max(0.06, top - 0.3 - rand() * 0.4)),
        opacity: round(0.45 + rand() * 0.3),
      };
    });
    const patchStart = u0 + rand() * 20;
    const patchTop = 0.15 + rand() * 0.5;
    return {
      base: roofQuad(u0, u1, 0, 1),
      patch: roofQuad(patchStart, patchStart + 14 + rand() * 14, patchTop, patchTop + 0.12 + rand() * 0.15),
      // Corrosion along the cut edge at the eave, and at the mid-slope lap.
      edge: roofQuad(u0, u1, 0, 0.05 + rand() * 0.05),
      lap: roofQuad(u0 + rand() * 12, u1 - rand() * 12, 0.48, 0.515),
      streaks,
    };
  });
})();

// Solar array: rows run along the eave and are laid from the eave upwards.
const PANEL_COLS = 11;
const PANEL_ROWS = 4;
const PANEL_W = 36;
const PANEL_GAP = 4;
const PANEL_DEPTH = 0.19;
const ROW_GAP = 0.025;
const FIRST_ROW = 0.1;
const PANEL_MARGIN = (ROOF_LENGTH - (PANEL_COLS * (PANEL_W + PANEL_GAP) - PANEL_GAP)) / 2;

const panelRows = Array.from({ length: PANEL_ROWS }, (_, r) => {
  const t0 = FIRST_ROW + r * (PANEL_DEPTH + ROW_GAP);
  const t1 = t0 + PANEL_DEPTH;
  const tMid = (t0 + t1) / 2;
  const panels = Array.from({ length: PANEL_COLS }, (_, c) => {
    const u0 = PANEL_MARGIN + c * (PANEL_W + PANEL_GAP);
    const u1 = u0 + PANEL_W;
    const third = PANEL_W / 3;
    return {
      outline: roofQuad(u0, u1, t0, t1),
      cells:
        roofLine(u0 + third, t0, u0 + third, t1) +
        roofLine(u0 + 2 * third, t0, u0 + 2 * third, t1) +
        roofLine(u0, tMid, u1, tMid),
    };
  });
  // One combined shape per row for the lime glow.
  const glow = panels.map((p) => `M${p.outline.replaceAll(" ", "L")}Z`).join("");
  return { panels, glow };
});

// Front wall openings.
const officeWindows = [356, 404].flatMap((y) =>
  [252, 304, 356, 408].map((x) => ({ x, y, width: 38, height: 30 })),
);
const stripWindows = Array.from({ length: 5 }, (_, i) => ({
  x: 492 + i * 46.5,
  y: 358,
  width: 34,
  height: 22,
}));
const windows = [...officeWindows, ...stripWindows];
const rollerDoors = [492, 612];

// Frames and glazing bars, drawn over the glass whether it is lit or not.
const windowFrames = windows
  .map(({ x, y, width, height }) => {
    const transom = height > 24 ? `M${x} ${y + height * 0.4}h${width}` : "";
    return `M${x} ${y}h${width}v${height}h-${width}ZM${x + width / 2} ${y}v${height}${transom}`;
  })
  .join("");

// Gable end (right-hand side wall) and its cladding.
const gableFrontTop: Point = [WALL.right, WALL.eave];
const gableRidge: Point = [WALL.right + SLOPE.x, WALL.eave + SLOPE.y];
const gableBackTop: Point = [WALL.right + DEPTH.x, WALL.eave - DEPTH.y];
const gable = toPoints([
  [WALL.right, GROUND],
  gableFrontTop,
  gableRidge,
  gableBackTop,
  [WALL.right + DEPTH.x, GROUND - DEPTH.y],
]);

function gableTopAt(x: number) {
  const [rx, ry] = gableRidge;
  if (x <= rx) return WALL.eave + (x - WALL.right) * (SLOPE.y / SLOPE.x);
  const [bx, by] = gableBackTop;
  return ry + ((x - rx) * (by - ry)) / (bx - rx);
}

const gableCladding = Array.from({ length: 13 }, (_, i) => {
  const x = WALL.right + 8 + i * 8;
  const bottom = GROUND - ((x - WALL.right) * DEPTH.y) / DEPTH.x;
  return `M${x} ${round(bottom)}V${round(gableTopAt(x) + 4)}`;
}).join("");

const wallCladding = Array.from({ length: 49 }, (_, i) => `M${WALL.left + 10 + i * 10} 338V500`).join("");

const stars = (() => {
  const rand = seeded(5);
  return Array.from({ length: 16 }, () => ({
    cx: round(20 + rand() * 960),
    cy: round(18 + rand() * 200),
    r: round(0.9 + rand() * 1.4),
    opacity: round(0.45 + rand() * 0.55),
  }));
})();

// Battery charge bars, bottom to top. Two stay lit in the finished scene.
const batteryBars = [492, 479, 466, 453];
const FINAL_CHARGE = 2;

export function BuildingIllustration() {
  return (
    <svg
      viewBox="0 0 1000 625"
      role="img"
      aria-labelledby="rts-title"
      className="block h-auto w-full"
    >
      <title id="rts-title">
        An industrial building whose worn metal roof is refurbished, then fitted with
        solar panels that charge a battery, which lights the building after dark.
      </title>
      <defs>
        <linearGradient id="rts-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-border-grey)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-off-white)" }} />
        </linearGradient>
        <radialGradient id="rts-sun-glow">
          <stop offset="0" style={{ stopColor: "var(--color-lime)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--color-lime)", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="rts-window-glow">
          <stop offset="0" style={{ stopColor: "var(--color-lime)", stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: "var(--color-lime)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1000" height="625" fill="url(#rts-sky)" />
      <rect data-scene="sky-night" width="1000" height="625" className="fill-deep-base" />
      <g>
        {stars.map((star, i) => (
          <circle
            key={i}
            data-scene="star"
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fillOpacity={star.opacity}
            className="fill-off-white"
          />
        ))}
      </g>
      <g data-scene="sun" transform="translate(880 470)" opacity="0">
        <circle r="120" fill="url(#rts-sun-glow)" />
        <circle r="28" className="fill-lime" />
      </g>

      {/* Neighbouring units on the horizon */}
      <g className="fill-mid-grey" opacity="0.3">
        <path d="M-10 520V462h70v-22h14v22h76v58Z" />
        <path d="M846 520V472l28-26v26l28-26v26l28-26v26l28-26v26l28-26v26h20v48Z" />
      </g>

      {/* Yard */}
      <rect y={GROUND} width="1000" height={625 - GROUND} className="fill-deep-base" />
      <path d={`M0 ${GROUND}H1000`} className="stroke-charcoal" strokeWidth="2" />
      <path
        d="M40 590H1000"
        className="stroke-border-grey"
        strokeOpacity="0.14"
        strokeWidth="3"
        strokeDasharray="34 26"
      />

      {/* Battery storage cabinet */}
      <g>
        <rect x="90" y="516" width="80" height="4" className="fill-charcoal" />
        <rect x="96" y="438" width="68" height="80" className="fill-border-grey" />
        <rect x="92" y="432" width="76" height="8" className="fill-mid-grey" />
        <path d="M130 446V510M140 452h16M140 458h16M140 464h16" className="stroke-mid-grey" strokeWidth="1.5" />
        <rect x="106" y="450" width="18" height="56" rx="1.5" className="fill-deep-base" />
        <path d="m150 476-6 9h5l-3 8 8-11h-5l3-6Z" className="fill-deep-green" />
      </g>

      {/* Cable runs: roof to battery, battery to building */}
      <path d="M244 336V476q0 8-8 8H164" fill="none" className="stroke-mid-grey" strokeWidth="3" />
      <path d="M164 500h66" fill="none" className="stroke-mid-grey" strokeWidth="3" />

      {/* Building */}
      <polygon points={gable} className="fill-charcoal" />
      <polygon points={gable} className="fill-deep-base" opacity="0.32" />
      <path d={gableCladding} className="stroke-deep-base" strokeOpacity="0.3" strokeWidth="1.2" />
      <rect x={WALL.left} y={WALL.eave} width={ROOF_LENGTH} height={GROUND - WALL.eave} className="fill-charcoal" />
      <path d={wallCladding} className="stroke-deep-base" strokeOpacity="0.2" strokeWidth="1.2" />
      <rect x={WALL.left} y="500" width={ROOF_LENGTH} height="20" className="fill-deep-base" opacity="0.3" />

      {windows.map((w, i) => (
        <g key={i}>
          <rect {...w} className="fill-mid-grey" />
          <rect x={w.x} y={w.y} width={w.width} height={w.height * 0.4} className="fill-off-white" opacity="0.14" />
        </g>
      ))}
      {rollerDoors.map((x) => (
        <g key={x}>
          <rect x={x} y="404" width="100" height="116" className="fill-mid-grey" />
          <path
            d={Array.from({ length: 13 }, (_, i) => `M${x} ${412 + i * 8.5}h100`).join("")}
            className="stroke-charcoal"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
          <rect x={x} y="404" width="100" height="116" fill="none" className="stroke-deep-base" strokeWidth="3" />
        </g>
      ))}
      <rect x="306" y="452" width="32" height="68" className="fill-deep-base" />
      <rect x="298" y="446" width="48" height="6" className="fill-deep-base" />
      <rect x={WALL.left - 6} y={WALL.eave - 3} width={ROOF_LENGTH + 12} height="10" className="fill-deep-base" />

      {/* Roof: refurbished sheets underneath, weathered sheets on top */}
      <polygon points={roofQuad(0, ROOF_LENGTH, 0, 1)} className="fill-mid-grey" />
      <path d={ribs} className="stroke-border-grey" strokeOpacity="0.22" strokeWidth="1.2" />
      <path d={sheetJoints} className="stroke-border-grey" strokeOpacity="0.4" strokeWidth="1.4" />
      <polyline
        points={toPoints([gableFrontTop, gableRidge, gableBackTop])}
        fill="none"
        className="stroke-deep-base"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={roofLine(0, 1, ROOF_LENGTH, 1)} className="stroke-border-grey" strokeOpacity="0.55" strokeWidth="3" />

      {wornSheets.map((sheet, i) => (
        <g key={i} data-scene="worn" opacity="0">
          <polygon points={sheet.base} className="fill-rust-dark" opacity="0.6" />
          <polygon points={sheet.patch} className="fill-rust" opacity="0.3" />
          <polygon points={sheet.lap} className="fill-rust" opacity="0.6" />
          {sheet.streaks.map((streak, j) => (
            <polygon key={j} points={streak.shape} className="fill-rust" opacity={streak.opacity} />
          ))}
          <polygon points={sheet.edge} className="fill-rust-dark" />
        </g>
      ))}

      {/* Solar array */}
      {panelRows.map((row, r) => (
        <g key={r}>
          {row.panels.map((panel, c) => (
            <g key={c} data-scene="panel" data-row={r}>
              <polygon points={panel.outline} transform="translate(-3 3)" className="fill-deep-base" opacity="0.35" />
              <polygon points={panel.outline} className="fill-deep-base stroke-border-grey" strokeOpacity="0.55" strokeWidth="1" />
              <path d={panel.cells} className="stroke-mid-grey" strokeOpacity="0.7" strokeWidth="0.8" />
            </g>
          ))}
        </g>
      ))}
      {panelRows.map((row, r) => (
        <path key={r} data-scene="panel-glow" d={row.glow} className="fill-lime" opacity="0" />
      ))}

      {/* Survey drone */}
      <g data-scene="drone" transform="translate(1120 40)" opacity="0">
        <polygon data-scene="drone-beam" points="-6,8 6,8 52,118 -52,118" className="fill-light-green" opacity="0" />
        <path d="M-26-6-12 0M26-6 12 0" className="stroke-charcoal" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-26" cy="-8" rx="13" ry="2.6" className="fill-mid-grey" />
        <ellipse cx="26" cy="-8" rx="13" ry="2.6" className="fill-mid-grey" />
        <rect x="-14" y="-5" width="28" height="10" rx="4" className="fill-charcoal" />
        <circle cy="7" r="3.2" className="fill-deep-base" />
      </g>

      {/* Night */}
      <rect data-scene="night-shade" width="1000" height="625" className="fill-deep-base" opacity="0.55" />
      <g data-scene="window-glow">
        <ellipse cx="330" cy="396" rx="135" ry="72" fill="url(#rts-window-glow)" />
        <ellipse cx="602" cy="369" rx="150" ry="42" fill="url(#rts-window-glow)" />
      </g>
      {windows.map((w, i) => (
        <rect key={i} data-scene="window-lit" {...w} className="fill-lime" opacity="0.92" />
      ))}
      <path d={windowFrames} fill="none" className="stroke-deep-base" strokeOpacity="0.6" strokeWidth="2" />

      {/* Battery charge level and energy flow, kept bright after dark */}
      {batteryBars.map((y, i) => (
        <rect
          key={y}
          data-scene="battery-bar"
          x="109"
          y={y}
          width="12"
          height="10"
          className="fill-brand-green"
          opacity={i < FINAL_CHARGE ? 1 : 0.2}
        />
      ))}
      <path
        data-scene="flow-roof"
        d="M244 336V476q0 8-8 8H164"
        fill="none"
        className="stroke-lime"
        strokeWidth="3"
        strokeDasharray="7 9"
        opacity="0"
      />
      <path
        data-scene="flow-building"
        d="M164 500h66"
        fill="none"
        className="stroke-lime"
        strokeWidth="3"
        strokeDasharray="7 9"
      />
    </svg>
  );
}
