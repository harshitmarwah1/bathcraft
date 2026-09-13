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
