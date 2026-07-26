import Link from "next/link";
import AccentRule from "@/components/AccentRule";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-7xl font-light tracking-tight text-line">404</p>
      <h1 className="display mt-8 text-3xl sm:text-4xl">
        Cartridge not recognised
      </h1>
      <AccentRule className="mt-8" />
      <p className="mt-8 max-w-md font-serif text-lg leading-relaxed text-body">
        Blow into it, reseat it, try again. Or head back to somewhere that
        actually exists.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-surface transition-opacity hover:opacity-80"
        >
          Home
        </Link>
        <Link
          href="/games"
          className="border border-line px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-shell-light"
        >
          All games
        </Link>
      </div>
    </div>
  );
}
