# Game images

One folder per game, named after the game's slug — the filename of its markdown
file in `content/games/`.

    public/games/actraiser/front.jpg      ->  /games/actraiser/front.jpg
    public/games/actraiser/back.jpg       ->  /games/actraiser/back.jpg
    public/games/actraiser/screen-1.png   ->  /games/actraiser/screen-1.png

Per-game folders rather than one flat directory: at 765 games with several
images each, a flat folder is thousands of files deep and impossible to work in.

## Use the script

Don't resize by hand. From the repository root:

```bash
npm run image -- actraiser front  ~/scans/actraiser-front.tiff
npm run image -- actraiser back   ~/scans/actraiser-back.tiff
npm run image -- actraiser screen ~/captures/fillmore.png
```

It writes the correctly sized and named file into the right folder and prints
the markdown to paste. Screenshots number themselves — `screen-1.png`,
`screen-2.png`, and so on. Box art refuses to overwrite unless you pass
`--force`. A mistyped slug is caught before anything is written.

Run `npm run image` with no arguments for the full usage.

## Referencing them

```markdown
## Box art

![ActRaiser, PAL front cover](/games/actraiser/front.jpg)
![ActRaiser, back cover](/games/actraiser/back.jpg)

*PAL release, 1992.*

Notes on the art.
```

A single image is centred and capped at 22rem wide. **Two or more images in the
same block become a grid** — two up on a wide screen, one up on a phone — so put
the box front and back together, and screenshots together. An italic line
directly beneath is styled as a caption. Everything is lazy-loaded.

**Every image opens full size when clicked**, with the alt text shown beneath as
a caption. Screenshots enlarge to a whole-number multiple of their native size
wherever there is room for at least 2x, so the pixels stay square; box scans fit
the viewport but are never upscaled past their own resolution. This is also the
reason alt text is worth writing properly — it is visible copy, not just markup.

## What the script does, and why

**Box art** is resized to 1000px on the long edge and saved as JPEG at quality
82 with no chroma subsampling. It displays at 22rem, so 1000px is generous even
on a high-density screen.

**Screenshots are never resampled.** SNES output is 256×224 pixel art, the page
renders it with `image-rendering: pixelated`, and the browser does the crisp
upscale at display time — so enlarging the file first only makes it bigger for
no visible gain. A capture taken at an exact multiple (an emulator running at
4×) is reduced back to native by dropping whole pixels, which is exact and never
interpolates. A capture at some other size is left alone rather than resampled.

PNGs are encoded twice, as a palette image and as truecolour, and the palette
version is kept only if it decodes back pixel-identical. A SNES screen is
usually within 256 colours, so that is normally a large lossless saving; shots
with more colours quietly keep full fidelity instead.

**The file extension matters.** The stylesheet applies `image-rendering:
pixelated` to `.png` only, so screenshots stay crisp and box scans stay smooth.
Keep box art as `.jpg` and screenshots as `.png` — the script already does.

## Sizes

| Image       | Result                 | Roughly   |
| ----------- | ---------------------- | --------- |
| Box front   | 1000px long edge, JPEG | ~150 KB   |
| Box back    | 1000px long edge, JPEG | ~150 KB   |
| Screenshots | native resolution, PNG | ~10–30 KB |

About 400 KB per game, so roughly 300 MB across the full 765 — comfortable for
a git repository. Committing unresized 3000px scans instead would come to
several gigabytes, which is not.

## Read this before committing anything

Every image committed to git stays in the repository history **forever**, even
if you later delete or replace it. Getting it right the first time is far
easier than rewriting history later. Run the script, check the size it reports,
then commit.
