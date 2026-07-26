# Super A-Z

> Every Super Nintendo game. A to Z. No skipping.

A blog for playing the entire SNES library in alphabetical order and writing up
each game three ways: the game itself, the people who made it, and what the
magazines of the time said about it.

Built with Next.js (App Router) and Tailwind CSS. Write-ups are markdown files —
no database, no CMS, no admin login. Add a file, push, and the page exists.

---

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other commands:

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run build`     | Production build                      |
| `npm start`         | Serve the production build            |
| `npm run typecheck` | Type-check without building           |
| `npm run image`     | Resize and place a game image         |

---

## Adding a game

Create a markdown file in `content/games/`. The filename becomes the URL, so
`content/games/actraiser.md` is served at `/games/actraiser`.

```markdown
---
title: "The Addams Family"
sortTitle: "Addams Family, The"   # optional — controls A–Z position
developer: "Ocean Software"
publisher: "Ocean Software"
released: "1992-04-16"            # or just "1992"
region: "NA, PAL"
players: "1 player"
genre: ["Platformer", "Licensed"]
status: "played"                  # played | playing | upcoming
score: 6                          # out of 10, optional
excerpt: "One-line summary used on cards and in search results."
verdict: "The closing paragraph, pulled out into its own box."
magazineReviews:
  - magazine: "Super Play"
    issue: "Issue 4"
    date: "February 1993"
    score: "88%"
    reviewer: "Reviewer name"
    quote: "The quote, transcribed from your own copy."
draft: false                      # true = visible in dev, hidden in production
---

## The Game

Markdown body goes here. `##` headings become section rules.

## Box art

![ActRaiser, PAL front cover](/games/actraiser/front.jpg)
![ActRaiser, back cover](/games/actraiser/back.jpg)

*PAL release, 1992.*

Notes on the box art.

## The People

## The Press

## Screenshots

![Fillmore, act one](/games/actraiser/screen-1.png)
![The sim half](/games/actraiser/screen-2.png)
![Boss fight](/games/actraiser/screen-3.png)
```

Only `title` is genuinely required — everything else is optional and the page
adapts to whatever is present.

A few behaviours worth knowing:

- **Sorting and letters.** Games file under the first letter of `sortTitle`
  (falling back to `title`), and a leading "A", "An" or "The" is ignored. So
  `sortTitle: "Addams Family, The"` puts it under **A**, where it belongs.
- **Numbers file under `#`**, which leads the index ahead of A. Anything whose
  title does not start with a letter lands there, and those titles sort
  naturally — "3 Ninjas" before "10-Yard Fight", not after it. Set
  `sortTitle: "7th Saga, The"` to put *The 7th Saga* in the `#` bucket.
- **`status`** drives the coloured badge: `played` (green), `playing` (yellow),
  `upcoming` (purple). Only `played` entries count toward the progress bar.
- **`draft: true`** shows the entry when running `npm run dev` but excludes it
  from production builds — useful for work in progress.
- **Prev/next links** on each game page follow alphabetical order automatically.
- **Images** go in `public/games/<slug>/` — box front and back, screenshots.
  Use `npm run image -- <slug> front|back|screen <file>` rather than resizing
  by hand; it sizes, names and places the file and prints the markdown to
  paste. A single image is centred at 22rem, two or more in the same block
  become a grid, and an italic line beneath one is a caption. See
  `public/games/README.md` — and note that git keeps every version of a
  committed image forever, so oversized files cannot simply be deleted later.

---

## Things to replace before going live

The repo ships with placeholder content so the site is not empty. Swap these out:

1. **Your email address** — `src/lib/site.ts`, the `email` field. Currently
   `hello@example.com`.
2. **The seed write-ups** — the four files in `content/games/` are sample
   entries written to demonstrate the layout. The factual metadata (developer,
   publisher, year) is accurate, but **the review quotes are explicit
   placeholders**, not real quotes. Replace them with text transcribed from
   your own copies of the magazines, and credit the issue each time. Do not
   ship the placeholders.
3. **`LIBRARY_TARGET`** — `src/lib/site.ts`, currently `765`: the number of
   games on the list, Western releases only, excluding Japan exclusives. It is
   the denominator for the progress readout on the home page, so change it here
   if the scope of the list ever moves.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects
   Next.js and needs no configuration.
3. Deploy. You get a free `something.vercel.app` URL.

Every push to the default branch redeploys production; every pull request gets
its own preview URL.

`vercel.json` pins the framework to `nextjs`. That matters if the Vercel project
was created while the repo was still empty — with nothing to detect, Vercel
falls back to a plain static site, whose output directory is `public`, and the
build then fails with **"No Output Directory named 'public' found"**. Next.js
builds to `.next` and never produces a `public` output directory, so creating
one is not the fix; it would just deploy an empty static site instead. If you
hit that error, set **Settings → Build and Deployment → Framework Preset** to
**Next.js**, leave the build command and output directory overrides off, and
redeploy.

> **Plan note:** Vercel's free Hobby tier excludes commercial use. Fine for a
> personal blog; if the site starts carrying ads or sponsorship, that is a Pro
> plan ($20/month).

### Sharing the link before there is a domain

Vercel gives a project several URLs, and they do not behave alike:

| URL                                          | Public?                       |
| -------------------------------------------- | ----------------------------- |
| `super-a-z.vercel.app`                       | Yes — the production domain   |
| `super-a-z-git-<branch>-<user>.vercel.app`   | No — protected by default     |
| `super-a-z-<hash>-<user>.vercel.app`         | No — protected by default     |

The dashboard's **Visit** button and the links in the Deployments list point at
the branch and hash URLs, so the link that is easiest to copy is the one nobody
else can open — they get sent to a Vercel login instead. Take the short URL from
**Project → Domains** instead.

If even that one asks for a login, protection is set wider than the default:
**Settings → Deployment Protection → Vercel Authentication**. "Standard
Protection" exempts the production domain; "All Deployments" does not.

This stops mattering once a custom domain is attached — that domain is public
under the default settings.

### Moving to a paid domain later

The site is built so this is a settings change, not a code change.

1. Buy the domain. An independent registrar (Cloudflare, Namecheap) is worth
   preferring over buying through Vercel — same setup effort, but leaving
   Vercel later stays easy.
2. In Vercel: **Project → Settings → Domains → Add**, and enter the domain.
3. Add the DNS records Vercel shows you at your registrar. Typically an `A`
   record on the apex pointing at `76.76.21.21`, and a `CNAME` on `www`
   pointing at `cname.vercel-dns.com`.
4. Wait for DNS to resolve (usually minutes). HTTPS is issued automatically.
5. In **Settings → Environment Variables**, set:

   ```
   NEXT_PUBLIC_SITE_URL = https://yourdomain.com
   ```

   Then redeploy.

Step 5 is the only part that touches the app, and it exists because everything
that needs an absolute URL — canonical tags, Open Graph metadata, the sitemap —
reads from `siteConfig.url` in `src/lib/site.ts` rather than hardcoding a host.
Set the variable and every one of them updates at once.

The `.vercel.app` URL keeps working throughout, so there is no downtime window.
Preview deployments are marked `noindex` automatically (see `src/app/robots.ts`),
so only the real domain gets indexed.

### Adding a working contact form

The contact page currently uses a `mailto:` link, which needs no backend. If you
later want a real form, [Formspree](https://formspree.io) or a Next.js server
action wired to [Resend](https://resend.com) both drop in cleanly. Sending mail
*from* your own domain additionally needs SPF and DKIM records set up with the
mail provider — unrelated to the Vercel domain step above.

---

## Project layout

```
content/games/          Write-ups, one markdown file per game
src/app/                Routes: /, /games, /games/[slug], /contact
src/components/         Header, hamburger menu, cards, review cards
src/lib/games.ts        Reads and parses content/games at build time
src/lib/site.ts         Site name, tagline, email, nav, canonical URL
src/app/globals.css     The SNES palette and all shared styling
```

### The look

The console, not the screen: light grey plastic for surfaces, near black for
type, and the four controller-button colours — red, yellow, blue, green — used
sparingly as accents. The recurring four-segment colour rule is
`src/components/AccentRule.tsx`.

Everything is defined once in `src/app/globals.css` under `@theme`. Change the
values there and the whole site follows.

Two notes if you edit the palette:

- Each accent has a **deep** variant (`--color-red-deep` and so on) that is dark
  enough to pass contrast as small text on a light background. Use the vivid
  version for rules and fills, the deep version for type. Yellow especially —
  `--color-btn-yellow` is a fill colour only and should never be small text.
- Headings are set in Inter Light, and the long-form article body is set in
  Source Serif 4 so the write-ups read like the magazines they are about. The
  `.article` block in `globals.css` styles all rendered markdown.

---

## Legal

Not affiliated with Nintendo. Game titles, box art and magazine content belong to
their respective owners and are referenced for the purposes of review and
criticism.
