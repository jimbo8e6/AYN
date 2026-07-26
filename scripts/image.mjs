#!/usr/bin/env node
/**
 * Prepare an image for a game entry.
 *
 *   npm run image -- <slug> front|back|screen <source-file>
 *
 * Box art is resized to 1000px on the long edge and written as JPEG.
 *
 * Screenshots are NOT resampled. SNES output is 256x224 pixel art, the page
 * renders it with image-rendering: pixelated, and the browser does the crisp
 * upscale at display time — so pre-enlarging only inflates the file. The one
 * exception is a source captured at an integer multiple (an emulator running
 * at 4x), which is reduced back toward native by dropping whole pixels. That
 * is exact: no interpolation touches the image either way.
 *
 * PNGs are encoded twice, palette and truecolour, and the palette version is
 * kept only when it decodes back pixel-identical. SNES screens are usually
 * within 256 colours, so this is normally a large lossless saving; anything
 * with more colours silently keeps full fidelity instead.
 *
 * Output lands in public/games/<slug>/. Screenshots auto-number.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "games");
const PUBLIC_DIR = path.join(ROOT, "public", "games");

/** Rough per-file budgets from public/games/README.md, in kilobytes. */
const BUDGET_KB = { front: 250, back: 250, screen: 120 };

/** Native SNES width. Captures at multiples of this reduce back to it exactly. */
const NATIVE_WIDTH = 256;

const USAGE = `
Usage:  npm run image -- <slug> <kind> <source-file> [--force]

  slug    the game's markdown filename without .md, e.g. actraiser
  kind    front | back | screen
  source  path to the raw scan or capture

Examples:
  npm run image -- actraiser front ~/scans/actraiser-front.tiff
  npm run image -- actraiser back  ~/scans/actraiser-back.tiff
  npm run image -- actraiser screen ~/captures/fillmore.png

Box art  ->  1000px long edge, JPEG quality 82
Screens  ->  kept at native resolution, PNG, losslessly optimised

Screenshots number themselves: screen-1.png, screen-2.png, and so on.
Pass --force to overwrite an existing front.jpg or back.jpg.
`.trim();

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`\n${USAGE}\n`);
  process.exit(0);
}

const force = args.includes("--force");
const [slug, kind, source] = args.filter((a) => a !== "--force");

if (!slug || !kind || !source) fail(`Missing arguments.\n\n${USAGE}`);

if (!["front", "back", "screen"].includes(kind)) {
  fail(`Unknown kind "${kind}". Expected front, back or screen.`);
}

// Catch slug typos now rather than after writing files into a stray folder.
if (!fs.existsSync(path.join(CONTENT_DIR, `${slug}.md`))) {
  const near = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((s) => s.startsWith(slug.slice(0, 4)))
    .slice(0, 5);

  fail(
    `No entry called "${slug}" in content/games/.` +
      (near.length ? `\n  Did you mean: ${near.join(", ")}?` : ""),
  );
}

if (!fs.existsSync(source)) fail(`Source file not found: ${source}`);

const outDir = path.join(PUBLIC_DIR, slug);
fs.mkdirSync(outDir, { recursive: true });

/** Screenshots take the next free number; box art has a fixed name. */
function resolveOutput() {
  if (kind === "screen") {
    const existing = fs
      .readdirSync(outDir)
      .map((f) => /^screen-(\d+)\.png$/.exec(f))
      .filter(Boolean)
      .map((m) => Number(m[1]));
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return path.join(outDir, `screen-${next}.png`);
  }

  const file = path.join(outDir, `${kind}.jpg`);
  if (fs.existsSync(file) && !force) {
    fail(`${path.relative(ROOT, file)} already exists. Pass --force to replace it.`);
  }
  return file;
}

/**
 * Drop whole pixels to reduce an integer-upscaled capture back toward native.
 * Sampling the top-left of each factor x factor block is exact for an image
 * that was nearest-neighbour enlarged, and never interpolates.
 */
function dropPixels(data, width, height, channels, factor) {
  const w = Math.floor(width / factor);
  const h = Math.floor(height / factor);
  const out = Buffer.allocUnsafe(w * h * channels);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const from = (y * factor * width + x * factor) * channels;
      const to = (y * w + x) * channels;
      data.copy(out, to, from, from + channels);
    }
  }

  return { data: out, width: w, height: h };
}

/**
 * Encode raw pixels as PNG, preferring a palette when it round-trips
 * pixel-identical. Returns the smaller lossless result.
 */
async function encodePngLossless(raw, width, height, channels) {
  const base = { raw: { width, height, channels } };

  const truecolour = await sharp(raw, base)
    .png({ compressionLevel: 9, effort: 10, palette: false })
    .toBuffer();

  let palette;
  try {
    palette = await sharp(raw, base)
      .png({ compressionLevel: 9, effort: 10, palette: true, colours: 256 })
      .toBuffer();
  } catch {
    return { buffer: truecolour, mode: "truecolour" };
  }

  if (palette.length >= truecolour.length) {
    return { buffer: truecolour, mode: "truecolour" };
  }

  const check = await sharp(palette).raw().toBuffer({ resolveWithObject: true });
  const identical =
    check.info.width === width &&
    check.info.height === height &&
    check.info.channels === channels &&
    check.data.equals(raw);

  return identical
    ? { buffer: palette, mode: "palette" }
    : { buffer: truecolour, mode: "truecolour (over 256 colours)" };
}

const output = resolveOutput();
const meta = await sharp(source).metadata();
const notes = [];
let modeLabel = "";

if (kind === "screen") {
  const { data, info } = await sharp(source)
    .toColourspace("srgb")
    .raw()
    .toBuffer({ resolveWithObject: true });

  let frame = { data, width: info.width, height: info.height };

  // Reduce an integer-upscaled capture back toward native, exactly.
  const factor = Math.floor(info.width / NATIVE_WIDTH);
  if (factor >= 2 && info.width % factor === 0 && info.height % factor === 0) {
    frame = dropPixels(data, info.width, info.height, info.channels, factor);
    notes.push(`reduced ${factor}x by dropping whole pixels — no interpolation`);
  } else if (info.width > NATIVE_WIDTH * 2) {
    notes.push(
      `source is ${info.width}px wide, not a clean multiple of ${NATIVE_WIDTH};\n` +
        `  kept as-is rather than resampling. Capturing at 256x224 or an exact\n` +
        `  multiple gives smaller files.`,
    );
  }

  const encoded = await encodePngLossless(
    frame.data,
    frame.width,
    frame.height,
    info.channels,
  );
  modeLabel = encoded.mode;
  fs.writeFileSync(output, encoded.buffer);
} else {
  await sharp(source)
    .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(output);
}

const out = await sharp(output).metadata();
const kb = Math.round(fs.statSync(output).size / 1024);
const rel = path.relative(ROOT, output);
const webPath = `/${path
  .relative(path.join(ROOT, "public"), output)
  .split(path.sep)
  .join("/")}`;

console.log(`
  ${rel}
  ${meta.width}x${meta.height} ${meta.format}  ->  ${out.width}x${out.height} ${out.format}${
    modeLabel ? `, ${modeLabel}` : ""
  }, ${kb} KB
`);

for (const note of notes) console.log(`  Note: ${note}\n`);

if (kb > BUDGET_KB[kind]) {
  console.log(
    `  Note: ${kb} KB is above the ~${BUDGET_KB[kind]} KB budget for this kind.\n` +
      `  Fine occasionally; worth a look if it keeps happening.\n`,
  );
}

const markdown =
  kind === "screen"
    ? `![Describe the shot](${webPath})`
    : `![${slug} ${kind} cover](${webPath})`;

console.log(`  Markdown:\n\n    ${markdown}\n`);
