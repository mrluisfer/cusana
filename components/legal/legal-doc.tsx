"use client";

import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { defaultLocale, isLocale } from "@/lib/i18n/settings";
import { getLegalDoc, LEGAL_LAST_UPDATED, type LegalDocId } from "@/lib/legal";
import type { LegalBlock, LegalSection } from "@/lib/legal/types";
import { RichText } from "./rich-text";

// El copy legal es estático y cada bloque es único dentro de su sección, así
// que su contenido sirve como key estable.
function blockKey(block: LegalBlock) {
  return block.type === "ul"
    ? `ul:${block.items.join("\n")}`
    : `${block.type}:${block.text}`;
}

function SectionBlocks({ section }: { section: LegalSection }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-8"
    >
      <h2
        id={`${section.id}-heading`}
        className="mb-3 text-xl font-semibold text-foreground"
      >
        {section.title}
      </h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground">
        {section.blocks.map((block) => {
          if (block.type === "h3") {
            return (
              <h3
                key={blockKey(block)}
                className="mt-4 font-medium text-foreground"
              >
                {block.text}
              </h3>
            );
          }
          if (block.type === "ul") {
            return (
              <ul
                key={blockKey(block)}
                className="list-inside list-disc space-y-1 pl-4"
              >
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={blockKey(block)}>
              <RichText text={block.text} />
            </p>
          );
        })}
      </div>
    </section>
  );
}

export function LegalDocView({ doc: docId }: { doc: LegalDocId }) {
  const { i18n } = useTranslation();
  const locale = isLocale(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : defaultLocale;
  const doc = getLegalDoc(docId, locale);

  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(LEGAL_LAST_UPDATED));

  return (
    <article className="space-y-10">
      <header className="space-y-4 pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {doc.title}
        </h1>
        {doc.intro && (
          <p className="text-pretty text-muted-foreground">{doc.intro}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {doc.updatedLabel} {updated}
        </p>
        <Separator />
      </header>

      <nav aria-label={doc.tocLabel} className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
          {doc.tocLabel}
        </h2>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="transition-colors hover:text-foreground"
              >
                {section.title.replace(/^\d+\.\s*/, "")}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Separator />

      <div className="space-y-10">
        {doc.sections.map((section) => (
          <SectionBlocks key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
