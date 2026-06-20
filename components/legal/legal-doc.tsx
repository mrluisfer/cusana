"use client";

import { Separator } from "@/components/ui/separator";
import { getLegalDoc, LEGAL_LAST_UPDATED, type LegalDocId } from "@/lib/legal";
import { defaultLocale, isLocale } from "@/lib/i18n/settings";
import { useTranslation } from "react-i18next";
import { RichText } from "./rich-text";
import type { LegalSection } from "@/lib/legal/types";

function SectionBlocks({ section }: { section: LegalSection }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-8"
    >
      <h2
        id={`${section.id}-heading`}
        className="text-foreground mb-3 text-xl font-semibold"
      >
        {section.title}
      </h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">
        {section.blocks.map((block, i) => {
          if (block.type === "h3") {
            return (
              <h3 key={i} className="text-foreground mt-4 font-medium">
                {block.text}
              </h3>
            );
          }
          if (block.type === "ul") {
            return (
              <ul key={i} className="list-inside list-disc space-y-1 pl-4">
                {block.items.map((item, j) => (
                  <li key={j}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i}>
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
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {doc.title}
        </h1>
        {doc.intro && (
          <p className="text-muted-foreground text-pretty">{doc.intro}</p>
        )}
        <p className="text-muted-foreground text-sm">
          {doc.updatedLabel} {updated}
        </p>
        <Separator />
      </header>

      <nav aria-label={doc.tocLabel} className="space-y-2">
        <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">
          {doc.tocLabel}
        </h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="hover:text-foreground transition-colors"
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
