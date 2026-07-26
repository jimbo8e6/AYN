import type { Metadata } from "next";
import AccentRule from "@/components/AccentRule";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Corrections, magazine scans, requests and first-hand stories — get in touch with Super A-Z.",
};

const TOPICS = [
  {
    accent: "bg-btn-red",
    title: "Corrections",
    body: "Got a developer credit, release date or publisher wrong? Tell me and it gets fixed, with a note on the entry saying so.",
  },
  {
    accent: "bg-btn-yellow",
    title: "Magazine scans",
    body: "Sitting on a stack of Super Play, Mean Machines, Total! or Nintendo Power? Contemporary reviews are the hardest part of each write-up to source.",
  },
  {
    accent: "bg-btn-blue",
    title: "You made one of these",
    body: "If you worked on a SNES game in any capacity — code, art, music, QA, localisation, box copy — I would genuinely love to hear from you.",
  },
  {
    accent: "bg-btn-green",
    title: "Anything else",
    body: "Requests to jump the queue will be politely ignored. The alphabet is the alphabet.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20">
      <header className="pt-20 pb-14">
        <p className="eyebrow">Say hello</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">Contact</h1>
        <AccentRule className="mt-8" width="w-32" />
        <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-body">
          One person, one console, a lot of cartridges. Email is the best way to
          reach me and I read everything, even if replies can take a while.
        </p>
      </header>

      <div className="border border-line bg-surface p-10 text-center sm:p-14">
        <p className="eyebrow">Send a message</p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-6 inline-block text-2xl font-light tracking-tight break-all text-ink underline decoration-btn-yellow decoration-2 underline-offset-8 transition-colors hover:text-btn-red sm:text-3xl"
        >
          {siteConfig.email}
        </a>
        <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-muted">
          Include the game name in the subject line if you are writing about a
          specific entry &mdash; it makes finding it again much easier.
        </p>
      </div>

      <section className="mt-20">
        <h2 className="rule-heading">What to write in about</h2>
        <AccentRule className="mt-4" />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <li
              key={topic.title}
              className="flex flex-col border border-line bg-surface"
            >
              <span aria-hidden="true" className={`h-[3px] w-full ${topic.accent}`} />
              <div className="p-7">
                <h3 className="text-lg font-normal tracking-tight text-ink">
                  {topic.title}
                </h3>
                <p className="mt-3 font-serif leading-relaxed text-body">
                  {topic.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-line pt-10">
        <h2 className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
          A note on takedowns
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Magazine quotes are used here for review and criticism, with the
          publication and issue credited every time. If you hold the rights to
          something quoted on this site and would rather it was not, get in
          touch and it comes down &mdash; no argument.
        </p>
      </section>
    </div>
  );
}
