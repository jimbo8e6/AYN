/**
 * Single source of truth for anything that references the site's own address.
 *
 * Everything that needs an absolute URL (metadata, canonical tags, Open Graph
 * images, sitemap) reads from here, so moving from the free .vercel.app URL to
 * a paid domain is one environment variable change with no code edits.
 *
 * Set NEXT_PUBLIC_SITE_URL in the Vercel project settings once the real domain
 * is attached. Locally it falls back to localhost.
 */
const fallbackUrl = "http://localhost:3000";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel injects this for every deployment, including previews.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return fallbackUrl;
}

export const siteConfig = {
  name: "Super A-Z",
  tagline: "Every Super Nintendo game. A to Z. No skipping.",
  description:
    "A deep dive into every game released for the Super Nintendo, played and written up in alphabetical order — the game itself, the people who made it, and what the magazines of the day made of it.",
  url: resolveSiteUrl(),
  email: "hello@example.com",
  nav: [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

/**
 * Rough size of the full SNES library. Used for the progress readout on the
 * home page — adjust to whatever scope you settle on (worldwide releases,
 * PAL only, licensed only, and so on).
 */
export const LIBRARY_TARGET = 1757;
