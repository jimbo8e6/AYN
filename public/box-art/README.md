# Box art

Drop box art scans in here, named after the game's slug — the filename of its
markdown file in `content/games/`.

    public/box-art/actraiser.jpg   ->   /box-art/actraiser.jpg

Then reference it from the game's `## Box art` section:

```markdown
## Box art

![ActRaiser, PAL box art](/box-art/actraiser.jpg)

*PAL release, 1992.*

Your notes about the box art go here.
```

The image is centred and capped at 22rem wide, so both portrait and landscape
boxes sit correctly. An italic line directly beneath is styled as a caption.

## Sizing

Resize before committing — 800px on the long edge is plenty at the size these
display, and keeps the repository from ballooning across hundreds of entries.
JPEG for scans, PNG only if the art has flat colour and hard edges.

## Note

`public/` is Next.js's standard folder for static assets and is unrelated to
the build output, which goes to `.next`. See the deployment section of the root
README if that distinction ever comes up again.
