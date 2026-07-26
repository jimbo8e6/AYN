import Link from "next/link";
import AccentRule from "./AccentRule";
import { siteConfig } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line bg-shell-light">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg tracking-tight text-ink">
              <span className="font-light">Super</span>{" "}
              <span className="font-semibold">A&#8211;Z</span>
            </p>
            <AccentRule className="mt-3" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-line-soft pt-6 text-xs leading-relaxed text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Not affiliated
          with, endorsed by, or connected to Nintendo. Game titles, box art and
          magazine content remain the property of their respective owners and
          are referenced here for the purposes of review and criticism.
        </p>
      </div>
    </footer>
  );
}
