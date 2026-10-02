import { Fragment } from "react";

const BOLD = /(\*\*[^*]+\*\*)/g;

/**
 * Renders text with simple `**bold**` markers as <strong> spans.
 * Keeps legal copy in plain data files while allowing inline emphasis.
 */
export function RichText({ text }: { text: string }) {
  // La posición de cada fragmento dentro del texto es una key única y estable.
  // Los fragmentos vacíos que deja `split` no renderizan nada y se descartan
  // para que no compartan posición con el siguiente.
  const parts: { part: string; start: number }[] = [];
  let start = 0;
  for (const part of text.split(BOLD)) {
    if (part) parts.push({ part, start });
    start += part.length;
  }

  return (
    <>
      {parts.map(({ part, start }) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={start} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={start}>{part}</Fragment>;
      })}
    </>
  );
}
