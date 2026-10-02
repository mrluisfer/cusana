// Plugin JS de oxlint que reemplaza el dominio `drizzle` de Biome
// (noDrizzleDeleteWithoutWhere / noDrizzleUpdateWithoutWhere): marca
// `db.delete(tabla)` y `db.update(tabla)` cuya cadena no llega a `.where()`,
// porque sin él la query afecta todas las filas de la tabla.
//
// No usamos eslint-plugin-drizzle porque requiere @typescript-eslint/utils sin
// declararlo como dependencia, y ese paquete no soporta TypeScript 7.
//
// Opción: { drizzleObjectName: string[] } — identificadores que son instancias
// de Drizzle (por defecto ["db"]). Así no se marca `set.delete(x)` y similares.

// Sube por la cadena `db.delete(t).returning().where(...)` buscando `.where`.
function chainHasWhere(call) {
  let node = call;
  while (
    node.parent?.type === "MemberExpression" &&
    node.parent.object === node
  ) {
    const member = node.parent;
    if (
      member.property.type === "Identifier" &&
      member.property.name === "where"
    ) {
      return true;
    }
    const next = member.parent;
    if (next?.type !== "CallExpression" || next.callee !== member) return false;
    node = next;
  }
  return false;
}

function requireWhere(method) {
  return {
    meta: {
      type: "problem",
      docs: {
        description: `Exige \`.where()\` en las queries \`${method}\` de Drizzle.`,
      },
      schema: [
        {
          type: "object",
          properties: {
            drizzleObjectName: { type: "array", items: { type: "string" } },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        missingWhere: `Sin \`.where(...)\`, \`{{object}}.${method}(...)\` afecta todas las filas de la tabla.`,
      },
    },
    create(context) {
      const names = new Set(context.options[0]?.drizzleObjectName ?? ["db"]);
      return {
        CallExpression(node) {
          const { callee } = node;
          if (callee.type !== "MemberExpression" || callee.computed) return;
          if (callee.property.name !== method) return;
          if (callee.object.type !== "Identifier") return;
          if (!names.has(callee.object.name)) return;
          if (chainHasWhere(node)) return;
          context.report({
            node,
            messageId: "missingWhere",
            data: { object: callee.object.name },
          });
        },
      };
    },
  };
}

export default {
  meta: { name: "drizzle" },
  rules: {
    "enforce-delete-with-where": requireWhere("delete"),
    "enforce-update-with-where": requireWhere("update"),
  },
};
