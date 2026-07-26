"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/site";

/** The Super Famicom face buttons, used as decoration on the menu panel. */
const FACE_BUTTONS = [
  { label: "A", className: "bg-btn-a" },
  { label: "B", className: "bg-btn-b" },
  { label: "X", className: "bg-btn-x" },
  { label: "Y", className: "bg-btn-y" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The overlay is portalled to <body>, which only exists after hydration.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; scroll locks while the overlay is up.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the panel so keyboard and screen reader users land there.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="main-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="pixel-frame-thin group relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] bg-panel-raised transition-colors hover:bg-purple [--pixel-color:var(--color-purple)] hover:[--pixel-color:var(--color-purple-bright)]"
      >
        <span
          className={`block h-[3px] w-5 bg-ink transition-transform duration-200 ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[3px] w-5 bg-ink transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-[3px] w-5 bg-ink transition-transform duration-200 ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Portalled to <body>: the header uses backdrop-blur, which makes it a
          containing block for fixed-position descendants and would otherwise
          trap this overlay inside the header's box. The overlay sits below the
          header's z-index on purpose, so the trigger stays visible as an X and
          doubles as the close button. */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-void/95 px-5 py-24 backdrop-blur-sm"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              id="main-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              tabIndex={-1}
              className="pixel-frame scanlines m-auto w-full max-w-md bg-panel outline-none [--pixel-color:var(--color-purple)]"
            >
              <div className="flex items-center justify-between border-b-2 border-edge bg-panel-raised px-5 py-3">
                <span className="font-display text-[0.625rem] text-purple-pale uppercase">
                  Menu
                </span>
                <div className="flex gap-1.5" aria-hidden="true">
                  {FACE_BUTTONS.map((button) => (
                    <span
                      key={button.label}
                      className={`h-3 w-3 rounded-full ${button.className}`}
                    />
                  ))}
                </div>
              </div>

              <nav className="p-5">
                <ul className="flex flex-col">
                  {siteConfig.nav.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`group flex items-center gap-3 px-2 py-4 font-display text-sm transition-colors ${
                            active
                              ? "text-btn-b"
                              : "text-ink hover:text-purple-bright"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`text-btn-a transition-opacity ${
                              active
                                ? "animate-blink opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            &gt;
                          </span>
                          {item.label.toUpperCase()}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <p className="border-t-2 border-edge px-5 py-3 text-xs text-ink-faint">
                Press <kbd className="font-display text-[0.625rem]">ESC</kbd> to
                close
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
