/**
 * Gives every icon layer a real alpha channel, light and dark.
 *
 *   node scripts/gen-logo-icon-alpha.mjs
 *
 * WHY
 * gen-logo-layers.js wrote each layer as fully opaque pixels whose edges are
 * the source's antialiasing *composited against white*. Over white that is
 * invisible. Over the dark navbar every edge pixel is a near-white fringe, so
 * the mark reads as a fuzzy, doubled outline.
 *
 * HOW
 * The icon is drawn in exactly two inks (docs/logo-geometry.md), so every pixel
 * is some mix of slate, blue and white. Per pixel, solve (least squares over
 * the three channels) for the two coverages:
 *
 *     W − C = s·(W − SLATE) + b·(W − BLUE)
 *
 * s + b estimates coverage, but the raster's inks drift a few levels from the
 * two sampled colours, so it is only a floor. Alpha is raised where needed to
 * the smallest value that still lets the white composite be undone:
 *
 *     α = max(s + b, max_c (255 − C_c) / 255)
 *     F = (C − 255·(1 − α)) / α
 *
 * so the light set recomposites over white to the original (rounding only) and
 * each pixel keeps its own colour. The -dark set is F lifted in HSL exactly as
 * gen-logo-dark.mjs does, at the same alpha.
 */
import sharp from "sharp";

const SLATE = [0x4a, 0x5c, 0x72];
const BLUE = [0x03, 0x8f, 0xc2];

/* Dark-theme lift — same constants and method as gen-logo-dark.mjs. */
const BLUE_S = 0.45, SLATE_L = 0.66, BRAND_S = 0.70, BRAND_L = 0.56;

function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function toRgb(h, s, l) {
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1/6 ? p + (q - p) * 6 * t : t < 1/2 ? q : t < 2/3 ? p + (q - p) * (2/3 - t) * 6 : p; };
  return [f(h + 1/3) * 255, f(h) * 255, f(h - 1/3) * 255];
}

function lift(r, g, b) {
  const [h, s, l] = toHsl(r, g, b);
  return toRgb(...(s < BLUE_S ? [h, s, Math.max(l, SLATE_L)] : [h, BRAND_S, Math.max(l, BRAND_L)]));
}

const LAYERS = [
  "icon-frame-slate", "icon-drop", "icon-frame-blue-slate", "icon-faucet-slate",
  "icon-frame-blue", "icon-faucet", "icon-icon",
];

const u = SLATE.map((c) => 255 - c);
const v = BLUE.map((c) => 255 - c);
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const UU = dot(u, u), VV = dot(v, v), UV = dot(u, v), DET = UU * VV - UV * UV;

/** Coverages [slate, blue] for a composited pixel, clamped to a valid blend. */
function unmix(r, g, b) {
  const x = [255 - r, 255 - g, 255 - b];
  const xu = dot(x, u), xv = dot(x, v);
  let s = (xu * VV - xv * UV) / DET;
  let t = (xv * UU - xu * UV) / DET;
  if (s < 0) { s = 0; t = xv / VV; }
  if (t < 0) { t = 0; s = xu / UU; }
  s = Math.max(0, s); t = Math.max(0, t);
  const sum = s + t;
  if (sum > 1) { s /= sum; t /= sum; }
  return [s, t];
}

let worstOverall = 0;
const outputs = [];

for (const name of LAYERS) {
  const src = `public/logo/${name}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 0 && data[i] !== 255) {
      console.error(`  ${src} already has partial alpha — this script has run. Restore from git first.`);
      process.exit(1);
    }
  }

  const light = Buffer.alloc(data.length);
  const dark = Buffer.alloc(data.length);
  let worst = 0, far = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const [cs, cb] = unmix(r, g, b);
    const floor = (255 - Math.min(r, g, b)) / 255;
    const alpha = Math.min(1, Math.max(cs + cb, floor));
    const a = Math.round(alpha * 255);
    if (a === 0) continue;
    const A = a / 255;
    const F = [r, g, b].map((C) => Math.max(0, Math.min(255, Math.round((C - 255 * (1 - A)) / A))));
    const D = lift(...F);
    for (let c = 0; c < 3; c++) {
      light[i + c] = F[c];
      dark[i + c] = Math.round(D[c]);
      const back = Math.round(F[c] * A + 255 * (1 - A));
      const d = Math.abs(back - data[i + c]);
      worst = Math.max(worst, d);
      if (d > 3) far++;
    }
    light[i + 3] = a;
    dark[i + 3] = a;
  }

  console.log(`  ${name.padEnd(22)} worst channel error over white: ${worst}, channels off by >3: ${far}`);
  worstOverall = Math.max(worstOverall, worst);
  outputs.push([name, light, dark, info]);
}

if (worstOverall > 2) {
  console.error(`  worst error ${worstOverall} — too far from the original, not writing.`);
  process.exit(1);
}

for (const [name, light, dark, { width, height }] of outputs) {
  const raw = { raw: { width, height, channels: 4 } };
  await sharp(light, raw).png({ compressionLevel: 9 }).toFile(`public/logo/${name}.png`);
  await sharp(dark, raw).png({ compressionLevel: 9 }).toFile(`public/logo/${name}-dark.png`);
}
console.log("  wrote light + dark layers");
