// Prefija IDs cortos en los SVGs de assets/icons/ con el nombre del archivo
// para evitar colisiones en el DOM (svgl los genera sin namespacing y varios
// iconos juntos comparten `url(#a)`, robándose gradientes/clipPaths entre sí).
//
// Uso:
//   node scripts/namespace-svg-ids.mjs           Aplica el fix (idempotente).
//   node scripts/namespace-svg-ids.mjs --check   Falla si hay IDs sin prefijar.
//
// Detecta cualquier id="X" / url(#X) donde X tiene <= 4 chars y NO contiene
// "_" — los IDs ya prefijados (e.g. azure_a) son ignorados por ese filtro.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "assets/icons";
const CHECK_ONLY = process.argv.includes("--check");

// Considera "corto y sospechoso": <=4 chars alfanuméricos sin underscore.
// Esto deja pasar IDs ya prefijados (microsoft_onedrive_a) y los específicos
// que algunos SVGs traen (netflix_icon__defs4, clip0_906_1839).
const SHORT_ID = /^[a-zA-Z0-9]{1,4}$/;

const files = readdirSync(DIR).filter((f) => f.endsWith(".tsx"));
let totalChanged = 0;
const offenders = [];

for (const file of files) {
  const path = join(DIR, file);
  const src = readFileSync(path, "utf8");

  // Recolecta IDs cortos declarados en el archivo.
  const shortIds = new Set();
  for (const m of src.matchAll(/id="([^"]+)"/g)) {
    if (SHORT_ID.test(m[1])) shortIds.add(m[1]);
  }
  if (shortIds.size === 0) continue;

  if (CHECK_ONLY) {
    offenders.push(`${file}: ${[...shortIds].join(", ")}`);
    continue;
  }

  const prefix = file.replace(/\.tsx$/, "").replace(/-/g, "_") + "_";
  let out = src;
  for (const id of shortIds) {
    const safe = id.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
    out = out.replace(new RegExp(`id="${safe}"`, "g"), `id="${prefix}${id}"`);
    out = out.replace(new RegExp(`url\\(#${safe}\\)`, "g"), `url(#${prefix}${id})`);
    out = out.replace(new RegExp(`href="#${safe}"`, "g"), `href="#${prefix}${id}"`);
    out = out.replace(
      new RegExp(`xlinkHref="#${safe}"`, "g"),
      `xlinkHref="#${prefix}${id}"`,
    );
  }

  if (out !== src) {
    writeFileSync(path, out);
    totalChanged++;
    console.log(`✓ ${file} — ${shortIds.size} ids prefixed (${prefix}*)`);
  }
}

if (CHECK_ONLY) {
  if (offenders.length > 0) {
    console.error("\n✗ Iconos SVG con IDs sin prefijar (riesgo de colisión):");
    for (const line of offenders) console.error("  - " + line);
    console.error("\nCorrígelos con: node scripts/namespace-svg-ids.mjs");
    process.exit(1);
  }
  console.log("✓ Sin colisiones de ID en SVGs.");
} else if (totalChanged === 0) {
  console.log("✓ Sin cambios — todos los SVGs ya están limpios.");
}
