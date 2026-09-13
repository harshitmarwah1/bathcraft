/**
 * Slices the white lockup into the same wordmark halves the animation uses.
 *
 *   node scripts/gen-logo-dark.mjs
 *
 * WHY THIS EXISTS
 * `logo-full.png`, `wordmark-bath.png` and `wordmark-craft.png` are flat
 * rasters with NO alpha channel — the artwork is dark ink on an opaque white
 * rectangle. On a white page that is invisible. On the dark theme it is a
 * white box sitting behind the wordmark.
 *
 * `logo-white.png` is the same lockup drawn in white on transparency, so the
 * dark theme can use it directly. It is only supplied as the whole 846x272
 * lockup though, and the animation needs the two halves separately.
 *
 * The cut is the one recorded in docs/logo-geometry.md — the blank column
 * between "Bath" and "Craft" at local x 574 — so the white halves tile exactly
 * like the coloured ones and the animation geometry is unchanged.
 */
import sharp from "sharp";

const SRC = "public/logo/logo-white.png";

/** Local rects inside the 846x272 lockup. See docs/logo-geometry.md. */
const SLICES = [
  { out: "public/logo/wordmark-bath-white.png", left: 297, width: 277 },
  { out: "public/logo/wordmark-craft-white.png", left: 574, width: 272 },
];

const meta = await sharp(SRC).metadata();
if (meta.width !== 846 || meta.height !== 272) {
  console.error(`  ${SRC} is ${meta.width}x${meta.height}, expected 846x272.`);
  console.error("  The geometry in docs/logo-geometry.md no longer applies — re-measure.");
  process.exit(1);
}

for (const { out, left, width } of SLICES) {
  await sharp(SRC).extract({ left, top: 0, width, height: 272 }).png().toFile(out);
  const s = await sharp(out).stats();
  console.log(`  ${out}  ${width}x272  opaque: ${s.isOpaque}`);
}
console.log("\nDone. Both must report opaque: false — a true means no alpha and the box is back.");

/* ---------------------------------------------------------------------------
   Icon layers for the dark theme.

   The icon is drawn in two sampled colours (docs/logo-geometry.md): slate
   #4a5c72 and brand blue #038fc2. Measured against the dark surface #0c1b2f:

     slate  2.53:1   <- below WCAG 1.4.11's 3:1 for graphical objects
     blue   4.71:1   <- passes

   So the mark reads as a muddy outline in dark mode: the structural frame
   disappears and only the blue details survive.

   A CSS brightness() filter was the obvious fix and is the wrong one — it
   multiplies channels, so the blue's green and blue channels clip and the hue
   slides to cyan. Recolouring in HSL instead keeps each hue and lifts only
   lightness, which is the thing actually at fault.

   Blue lands on the dark theme's own --color-brand (#3fa9dd, H200 S70 L56) so
   the logo stays in step with every other blue on the page.
--------------------------------------------------------------------------- */

const ICON_LAYERS = [
  "icon-frame-slate", "icon-frame-blue", "icon-frame-blue-slate",
  "icon-faucet", "icon-faucet-slate", "icon-drop", "icon-icon",
];

/** Saturation above this is the brand blue; below it is the slate. */
const BLUE_S = 0.45;
/** Already bright (white highlights) — leave alone, they read fine on dark. */
const KEEP_ABOVE_L = 0.85;
const SLATE_L = 0.66;   // -> #96a6bb, 6.98:1
const BRAND_S = 0.70;   // -> #3fb3dd, 7.17:1
const BRAND_L = 0.56;

function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function toRgb(h, s, l) {
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1/6 ? p + (q - p) * 6 * t : t < 1/2 ? q : t < 2/3 ? p + (q - p) * (2/3 - t) * 6 : p; };
  return [f(h + 1/3) * 255, f(h) * 255, f(h - 1/3) * 255];
}

for (const name of ICON_LAYERS) {
  const src = `public/logo/${name}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let touched = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] === 0) continue;                       // fully transparent
    const [h, s, l] = toHsl(data[i], data[i + 1], data[i + 2]);
    if (l > KEEP_ABOVE_L) continue;
    // Only ever lighten. Darkening anything here would make the problem worse.
    const [nh, ns, nl] = s < BLUE_S ? [h, s, Math.max(l, SLATE_L)] : [h, BRAND_S, Math.max(l, BRAND_L)];
    const [r, g, b] = toRgb(nh, ns, nl);
    data[i] = Math.round(r); data[i + 1] = Math.round(g); data[i + 2] = Math.round(b);
    touched++;
  }
  const out = `public/logo/${name}-dark.png`;
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toFile(out);
  console.log(`  ${out}  ${touched} px recoloured`);
}
