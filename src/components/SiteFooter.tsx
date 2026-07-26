import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-edge bg-deep">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xs text-purple-bright">
            SUPER A&#8211;Z
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-faint">
            {siteConfig.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-dim transition-colors hover:text-btn-b"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t-2 border-edge px-5 py-5">
        <p className="mx-auto max-w-5xl text-xs leading-relaxed text-ink-faint">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Not affiliated
          with, endorsed by, or connected to Nintendo. Game titles, box art and
          magazine content remain the property of their respective owners and
          are referenced here for the purposes of review and criticism.
        </p>
      </div>
    </footer>
  );
}
