import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-edge bg-deep/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
        <Link
          href="/"
          className="group flex items-baseline gap-2 font-display text-ink"
          aria-label="Super A-Z, home"
        >
          <span className="text-[0.6875rem] text-console-dim transition-colors group-hover:text-console sm:text-xs">
            SUPER
          </span>
          <span className="text-base text-purple-bright transition-colors group-hover:text-btn-b sm:text-lg">
            A&#8211;Z
          </span>
        </Link>

        <HamburgerMenu />
      </div>
    </header>
  );
}
