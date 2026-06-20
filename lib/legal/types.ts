import type { Locale } from "@/lib/i18n/settings";

/**
 * A block of legal copy. Plain text may contain `**bold**` markers, which the
 * renderer turns into <strong> spans.
 */
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string };

export interface LegalSection {
  /** Stable anchor id (locale-independent) used for the table of contents. */
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  /** Short intro shown under the title. */
  intro?: string;
  /** Label for the table-of-contents heading, e.g. "Contents". */
  tocLabel: string;
  /** Prefix for the "last updated" line, e.g. "Last updated:". */
  updatedLabel: string;
  sections: LegalSection[];
}

export type LegalDocId = "terms" | "privacy";

export type LocalizedLegalDoc = Record<Locale, LegalDoc>;

/** ISO date of the last substantive revision; formatted per-locale at render. */
export const LEGAL_LAST_UPDATED = "2026-06-20";
