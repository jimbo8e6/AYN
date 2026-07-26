import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-shell/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          aria-label="Super A-Z, home"
        >
          <span className="text-lg font-light tracking-tight text-muted transition-colors group-hover:text-ink">
            Super
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">
            A&#8211;Z
          </span>
        </Link>

        <HamburgerMenu />
      </div>
    </header>
  );
}
