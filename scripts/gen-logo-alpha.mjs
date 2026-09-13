/**
 * Rebuilds the coloured lockup with a real alpha channel.
 *
 *   node scripts/gen-logo-alpha.mjs
 *
 * WHY
 * `logo-full.png` and the two wordmark halves are dark ink on an OPAQUE white
 * rectangle. That is invisible only while whatever sits behind them is also
 * pure white — and the navbar is not: once scrolled it is `bg-surface/90` with
 * a backdrop blur, so the bar picks up the hero photograph through it while the
 * logo's own white stays at 100%. The result is a white box around the wordmark
 * in LIGHT mode. The dark theme had the same problem for a different reason and
 * was fixed separately in gen-logo-dark.mjs.
 *
 * HOW
 * `logo-white.png` is the same artwork drawn white-on-transparent, so its alpha
 * channel IS the artwork's coverage mask — verified to agree with where
 * `logo-full.png` has ink. Borrow that alpha and undo the white composite:
 *
 *     composite  C = F·α + 255·(1 − α)      (what logo-full.png stores)
 *     so         F = (C − 255·(1 − α)) / α  (the colour we actually want)
 *
 * Recompositing the result over white must reproduce the original, and the
 * script checks exactly that before it writes anything.
 */
import sharp from "sharp";

const LOCKUP = "public/logo/logo-full.png";
const MASK = "public/logo/logo-white.png";

const full = await sharp(LOCKUP).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const mask = await sharp(MASK).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

if (full.info.width !== mask.info.width || full.info.height !== mask.info.height) {
  console.error("  lockup and mask differ in size — they must be the same artwork.");
  process.exit(1);
}

const { width, height } = full.info;
const out = Buffer.alloc(width * height * 4);
let recovered = 0;

for (let i = 0; i < out.length; i += 4) {
  const a = mask.data[i + 3];
  if (a === 0) { out[i] = out[i+1] = out[i+2] = out[i+3] = 0; continue; }
  const alpha = a / 255;
  for (let c = 0; c < 3; c++) {
    const composited = full.data[i + c];
    const v = (composited - 255 * (1 - alpha)) / alpha;
    out[i + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
  out[i + 3] = a;
  recovered++;
}

/* Flatten back onto white and compare with the original. This is the same
   standard the original slicing held itself to — see docs/logo-geometry.md. */
let worst = 0, differing = 0;
for (let i = 0; i < out.length; i += 4) {
  const alpha = out[i + 3] / 255;
  for (let c = 0; c < 3; c++) {
    const back = Math.round(out[i + c] * alpha + 255 * (1 - alpha));
    const d = Math.abs(back - full.data[i + c]);
    if (d > worst) worst = d;
    if (d > 1) differing++;
  }
}
console.log(`  recovered ${recovered} px | worst channel error ${worst} | channels off by >1: ${differing}`);
if (worst > 2) {
  console.error("  Recomposite does not match the original closely enough — not writing.");
  process.exit(1);
}

const raw = { raw: { width, height, channels: 4 } };
await sharp(out, raw).png().toFile("public/logo/logo-full-alpha.png");
console.log("  public/logo/logo-full-alpha.png");

/* Same cut as everything else — docs/logo-geometry.md. */
for (const [name, left, w] of [["wordmark-bath-alpha", 297, 277], ["wordmark-craft-alpha", 574, 272]]) {
  await sharp(out, raw).extract({ left, top: 0, width: w, height: 272 })
    .png().toFile(`public/logo/${name}.png`);
  console.log(`  public/logo/${name}.png  ${w}x272`);
}
