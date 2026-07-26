import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-display text-4xl text-btn-a">404</p>
      <h1 className="mt-8 font-display text-sm leading-relaxed text-ink sm:text-base">
        Cartridge not recognised
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-dim">
        Blow into it, reseat it, try again. Or head back to somewhere that
        actually exists.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="pixel-lift bg-btn-b px-6 py-3.5 font-display text-[0.625rem] text-void uppercase transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          Home
        </Link>
        <Link
          href="/games"
          className="pixel-frame-thin bg-panel-raised px-6 py-3.5 font-display text-[0.625rem] text-ink uppercase transition-colors hover:text-btn-b [--pixel-color:var(--color-purple)]"
        >
          All games
        </Link>
      </div>
    </div>
  );
}
