"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AccentRule from "./AccentRule";
import { siteConfig } from "@/lib/site";

/** Each destination takes one of the four controller-button colours. */
const ITEM_ACCENTS = ["bg-btn-red", "bg-btn-yellow", "bg-btn-blue", "bg-btn-green"];

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
        className="relative z-50 -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[6px] text-ink transition-opacity hover:opacity-60"
      >
        <span
          className={`block h-px w-6 bg-current transition-transform duration-200 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-current transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-px w-6 bg-current transition-transform duration-200 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
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
            className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-shell-dark/80 px-6 py-24 backdrop-blur-[2px]"
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
              className="m-auto w-full max-w-sm border border-line bg-surface shadow-xl outline-none"
            >
              <AccentRule width="w-full" />

              <div className="px-8 pt-8 pb-4">
                <p className="eyebrow">Menu</p>
              </div>

              <nav className="px-8 pb-8">
                <ul className="flex flex-col divide-y divide-line-soft">
                  {siteConfig.nav.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-center gap-4 py-5"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-2.5 w-2.5 shrink-0 transition-transform group-hover:scale-125 ${
                              ITEM_ACCENTS[index % ITEM_ACCENTS.length]
                            } ${active ? "" : "opacity-35"}`}
                          />
                          <span
                            className={`text-2xl tracking-tight transition-colors ${
                              active
                                ? "font-normal text-ink"
                                : "font-light text-muted group-hover:text-ink"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <p className="border-t border-line-soft px-8 py-4 text-xs text-muted">
                Press <kbd className="font-sans font-medium">Esc</kbd> to close
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
