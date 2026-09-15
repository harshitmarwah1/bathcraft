/**
 * Pale-blue blueprint outlines of the icon layers, for the icon animation.
 *
 *   node scripts/gen-logo-blueprint.mjs
 *
 * The animation's blueprint is the traced edge of the supplied icon, not a
 * redrawing. Tracing it live with an SVG erode/dilate filter under animated
 * masks re-rasterised every frame and could stall the renderer, so the outline
 * is computed once here instead: upscale each layer's alpha 2×, take
 * dilate − erode (a hairline on both edges of every stroke), flood it pale blue.
 */
import sharp from "sharp";

const LAYERS = ["frame-slate", "frame-blue", "drop", "faucet"];
const SCALE = 2;
const BLUEPRINT = [0x8e, 0xc3, 0xe3];

for (const name of LAYERS) {
  const src = `public/logo/icon-${name}.png`;
  const meta = await sharp(src).metadata();
  const W = meta.width * SCALE;
  const H = meta.height * SCALE;
  const alpha = await sharp(src)
    .ensureAlpha()
    .extractChannel(3)
    .resize(W, H, { kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const at = (x, y) => alpha[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let hi = 0;
      let lo = 255;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const v = at(x + dx, y + dy);
          if (v > hi) hi = v;
          if (v < lo) lo = v;
        }
      }
      const o = (y * W + x) * 4;
      out[o] = BLUEPRINT[0];
      out[o + 1] = BLUEPRINT[1];
      out[o + 2] = BLUEPRINT[2];
      out[o + 3] = Math.min(255, (hi - lo) * 1.15);
    }
  }
  const file = `public/logo/blueprint-${name}.png`;
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(file);
  console.log(`  ${file}  ${W}x${H}`);
}
