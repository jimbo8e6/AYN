# Game images

One folder per game, named after the game's slug — the filename of its markdown
file in `content/games/`.

    public/games/actraiser/front.jpg      ->  /games/actraiser/front.jpg
    public/games/actraiser/back.jpg       ->  /games/actraiser/back.jpg
    public/games/actraiser/screen-1.png   ->  /games/actraiser/screen-1.png

Per-game folders rather than one flat directory: at 765 games with four or five
images each, a flat folder is three thousand files deep and impossible to work
in.

Reference them from the markdown with normal image links:

```markdown
## Box art

![ActRaiser, PAL front cover](/games/actraiser/front.jpg)

*PAL release, 1992.*

Notes on the art.

![ActRaiser, back cover](/games/actraiser/back.jpg)
```

A single image is centred and capped at 22rem wide. **Two or more images in
the same block become a grid** — two up on a wide screen, one up on a phone — so
put the box front and back together, and screenshots together. An italic line
directly beneath is styled as a caption. Everything is lazy-loaded, and
screenshots render with `image-rendering: pixelated` so the pixel art stays
crisp when scaled.

## Sizing — read this before committing anything

Every image committed to git stays in the repository history **forever**, even
if you later delete or replace it. Getting the size right the first time is far
easier than rewriting history later.

Targets:

| Image       | Size                       | Format | Roughly |
| ----------- | -------------------------- | ------ | ------- |
| Box front   | 1000px on the longest edge | JPEG   | ~150 KB |
| Box back    | 1000px on the longest edge | JPEG   | ~150 KB |
| Screenshots | 512×448 (2× native SNES)   | PNG    | ~40 KB  |

That is roughly 500 KB per game, so about 380 MB across the full 765 — fine for
a git repository. Committing unresized scans at 3000px and 3 MB each would come
to several gigabytes, which is not.

SNES output is 256×224, so a screenshot only ever needs to be a clean 2×
multiple of that. Anything larger is upscaling noise.
