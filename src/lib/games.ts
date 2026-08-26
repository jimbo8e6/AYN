import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type GameStatus = "played" | "playing" | "upcoming";

export type MagazineReview = {
  magazine: string;
  issue?: string;
  date?: string;
  score?: string;
  reviewer?: string;
  quote?: string;
};

export type GameMeta = {
  slug: string;
  title: string;
  /** Title used for A–Z ordering, e.g. "Addams Family, The". Defaults to title. */
  sortTitle: string;
  letter: string;
  developer?: string;
  publisher?: string;
  released?: string;
  region?: string;
  players?: string;
  genre: string[];
  status: GameStatus;
  score?: number;
  verdict?: string;
  excerpt?: string;
  magazineReviews: MagazineReview[];
  youtubeId?: string;
  youtubeLabel?: string;
  draft: boolean;
};

export type Game = GameMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "games");

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}

function asReviews(value: unknown): MagazineReview[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const review = entry as Record<string, unknown>;
    if (typeof review.magazine !== "string") return [];
    return [
      {
        magazine: review.magazine,
        issue: review.issue ? String(review.issue) : undefined,
        date: review.date ? String(review.date) : undefined,
        score: review.score ? String(review.score) : undefined,
        reviewer: review.reviewer ? String(review.reviewer) : undefined,
        quote: review.quote ? String(review.quote) : undefined,
      },
    ];
  });
}

/**
 * The letter a game files under. Leading articles are ignored ("The Addams
 * Family" files under A) and anything not starting with a letter — numbers,
 * mostly — lands in "#", which sorts ahead of A.
 */
export function letterFor(sortTitle: string): string {
  const stripped = sortTitle.replace(/^(a|an|the)\s+/i, "").trim();
  const first = stripped.charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

/**
 * A URL-safe anchor for a letter section. "#" cannot go in a fragment as-is,
 * so the numeric bucket gets its own slug.
 */
export function letterAnchor(letter: string): string {
  return letter === "#" ? "letter-num" : `letter-${letter}`;
}

/** Human-readable name for a bucket, for screen readers. */
export function letterLabel(letter: string): string {
  return letter === "#" ? "a number" : letter;
}

function parseGame(fileName: string): Game {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title : slug;
  const sortTitle = typeof data.sortTitle === "string" ? data.sortTitle : title;
  const status: GameStatus =
    data.status === "playing" || data.status === "upcoming" ? data.status : "played";

  return {
    slug,
    title,
    sortTitle,
    letter: letterFor(sortTitle),
    developer: data.developer ? String(data.developer) : undefined,
    publisher: data.publisher ? String(data.publisher) : undefined,
    released: data.released ? String(data.released) : undefined,
    region: data.region ? String(data.region) : undefined,
    players: data.players ? String(data.players) : undefined,
    genre: asStringArray(data.genre),
    status,
    score: typeof data.score === "number" ? data.score : undefined,
    verdict: data.verdict ? String(data.verdict) : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    magazineReviews: asReviews(data.magazineReviews),
    youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
    youtubeLabel: data.youtubeLabel ? String(data.youtubeLabel) : undefined,
    draft: data.draft === true,
    content,
  };
}

let cache: Game[] | null = null;

/** Every game, sorted A–Z by sortTitle. Drafts are excluded in production. */
export function getAllGames(): Game[] {
  if (cache) return cache;

  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }

  const games = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(parseGame)
    .filter((game) => !game.draft || process.env.NODE_ENV === "development")
    // numeric so "3 Ninjas" comes before "10-Yard Fight" rather than after it.
    .sort((a, b) =>
      a.sortTitle.localeCompare(b.sortTitle, "en", {
        numeric: true,
      }),
    );

  cache = games;
  return games;
}

export function getGame(slug: string): Game | undefined {
  return getAllGames().find((game) => game.slug === slug);
}

export type LetterGroup = { letter: string; games: Game[] };

/** Games grouped into A–Z buckets, in alphabetical order. */
export function getGamesByLetter(): LetterGroup[] {
  const buckets = new Map<string, Game[]>();

  for (const game of getAllGames()) {
    const existing = buckets.get(game.letter);
    if (existing) existing.push(game);
    else buckets.set(game.letter, [game]);
  }

  return [...buckets.entries()]
    .map(([letter, games]) => ({ letter, games }))
    .sort(
      (a, b) => INDEX_LETTERS.indexOf(a.letter) - INDEX_LETTERS.indexOf(b.letter),
    );
}

/**
 * Every bucket the index can show, in display order. "#" leads, for games whose
 * titles start with a number.
 */
export const INDEX_LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

/** The most recently added write-ups, for the home page. */
export function getLatestGames(count: number): Game[] {
  return getAllGames()
    .filter((game) => game.status !== "upcoming")
    .slice(0, count);
}

export function countPlayed(): number {
  return getAllGames().filter((game) => game.status === "played").length;
}

/** "1990-12-16" -> "16 December 1990"; anything vaguer is passed through. */
export function formatReleased(released?: string): string | undefined {
  if (!released) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(released)) return released;

  const date = new Date(`${released}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return released;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
