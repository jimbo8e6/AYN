import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Corrections, magazine scans, requests and first-hand stories — get in touch with Super A-Z.",
};

const TOPICS = [
  {
    accent: "bg-btn-a",
    title: "Corrections",
    body: "Got a developer credit, release date or publisher wrong? Tell me and it gets fixed, with a note on the entry saying so.",
  },
  {
    accent: "bg-btn-b",
    title: "Magazine scans",
    body: "Sitting on a stack of Super Play, Mean Machines, Total! or Nintendo Power? Contemporary reviews are the hardest part of each write-up to source.",
  },
  {
    accent: "bg-btn-x",
    title: "You made one of these",
    body: "If you worked on a SNES game in any capacity — code, art, music, QA, localisation, box copy — I would genuinely love to hear from you.",
  },
  {
    accent: "bg-btn-y",
    title: "Anything else",
    body: "Requests to jump the queue will be politely ignored. The alphabet is the alphabet.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16">
      <header className="py-14">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Contact</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
          One person, one console, a lot of cartridges. Email is the best way to
          reach me and I read everything, even if replies can take a while.
        </p>
      </header>

      <div className="pixel-frame scanlines bg-panel p-8 text-center [--pixel-color:var(--color-purple)]">
        <p className="font-display text-[0.5625rem] text-ink-faint uppercase">
          Send a message
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-5 inline-block font-display text-sm break-all text-purple-bright transition-colors hover:text-btn-b sm:text-base"
        >
          {siteConfig.email}
        </a>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-faint">
          Include the game name in the subject line if you are writing about a
          specific entry &mdash; it makes finding it again much easier.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-base text-btn-b uppercase">
          What to write in about
        </h2>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <li
              key={topic.title}
              className="pixel-frame-thin flex flex-col bg-panel [--pixel-color:var(--color-edge)]"
            >
              <span aria-hidden="true" className={`h-1.5 w-full ${topic.accent}`} />
              <div className="p-6">
                <h3 className="font-display text-[0.6875rem] leading-relaxed text-ink uppercase">
                  {topic.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                  {topic.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t-2 border-edge pt-8">
        <h2 className="font-display text-[0.6875rem] text-ink-faint uppercase">
          A note on takedowns
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Magazine quotes are used here for review and criticism, with the
          publication and issue credited every time. If you hold the rights to
          something quoted on this site and would rather it was not, get in
          touch and it comes down &mdash; no argument.
        </p>
      </section>
    </div>
  );
}
