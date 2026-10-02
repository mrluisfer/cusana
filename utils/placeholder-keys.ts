// Keys estables para listas de placeholders (skeletons, celdas vacías) que se
// renderizan por posición y nunca se reordenan. Generarlas aquí evita usar el
// índice del `.map()` como key (react/no-array-index-key).
export function placeholderKeys(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}-${i}`);
}
