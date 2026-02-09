// lib/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

function initDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Define it in your environment before accessing the database.",
    );
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    if (!dbInstance) {
      dbInstance = initDb();
    }

    const value = (dbInstance as unknown as Record<PropertyKey, unknown>)[prop];
    return typeof value === "function" ? value.bind(dbInstance) : value;
  },
});
