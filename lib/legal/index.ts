import type { Locale } from "@/lib/i18n/settings";
import { privacyDoc } from "./privacy";
import { termsDoc } from "./terms";
import type { LegalDoc, LegalDocId } from "./types";

export { LEGAL_LAST_UPDATED } from "./types";
export type { LegalDoc, LegalDocId } from "./types";

export function getLegalDoc(id: LegalDocId, locale: Locale): LegalDoc {
  const docs = id === "terms" ? termsDoc : privacyDoc;
  return docs[locale] ?? docs.es;
}
