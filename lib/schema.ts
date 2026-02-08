import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  subscriptions: many(subscriptions),
  subscriptionEvents: many(subscriptionEvents),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Enums
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const currencyEnum = pgEnum("currency", ["MXN", "USD", "EUR"]);

// Tabla de suscripciones
export const subscriptions = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  platform: text("platform").notNull(), // "netflix", "spotify", etc.

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull().default("MXN"),

  billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),
  billingDay: integer("billing_day").notNull(), // 1-31

  // Opcionales útiles
  description: text("description"),
  url: text("url"), // Link al servicio

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relaciones
export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    user: one(user, {
      fields: [subscriptions.userId],
      references: [user.id],
    }),
    events: many(subscriptionEvents),
  }),
);

// Tipos inferidos
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

// ─── Historial / Audit Log de Suscripciones ───────────────────────────

export const subscriptionEventTypeEnum = pgEnum("subscription_event_type", [
  "created",
  "updated",
  "deleted",
  "price_changed",
  "cycle_changed",
  "reactivated",
]);

/**
 * Tabla de eventos/historial de suscripciones.
 * Funciona como un audit log inmutable (append-only):
 * - Cada acción sobre una suscripción genera un INSERT.
 * - Nunca se actualiza ni elimina un registro de esta tabla.
 * - `snapshot` guarda el estado completo de la suscripción en ese momento.
 * - `changes` guarda solo los campos que cambiaron (para updates).
 */
export const subscriptionEvents = pgTable(
  "subscription_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // Quién hizo la acción
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // A qué suscripción se refiere (nullable: si fue deleted, la sub ya no existe)
    subscriptionId: text("subscription_id"),

    // Tipo de evento
    eventType: subscriptionEventTypeEnum("event_type").notNull(),

    // Snapshot completo de la suscripción al momento del evento
    snapshot: jsonb("snapshot").$type<SubscriptionSnapshot>().notNull(),

    // Para updates: solo los campos que cambiaron { field: { from, to } }
    changes: jsonb("changes").$type<SubscriptionChanges | null>(),

    // Metadata opcional (IP, user agent, fuente, etc.)
    metadata: jsonb("metadata").$type<EventMetadata | null>(),

    // Cuándo ocurrió el evento
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("sub_events_user_idx").on(table.userId),
    index("sub_events_subscription_idx").on(table.subscriptionId),
    index("sub_events_type_idx").on(table.eventType),
    index("sub_events_created_idx").on(table.createdAt),
  ],
);

// Relaciones
export const subscriptionEventsRelations = relations(
  subscriptionEvents,
  ({ one }) => ({
    user: one(user, {
      fields: [subscriptionEvents.userId],
      references: [user.id],
    }),
    subscription: one(subscriptions, {
      fields: [subscriptionEvents.subscriptionId],
      references: [subscriptions.id],
    }),
  }),
);

// ─── Tipos para JSONB ─────────────────────────────────────────────────

/** Estado completo de la suscripción al momento del evento */
export type SubscriptionSnapshot = {
  name: string;
  platform: string;
  price: string;
  currency: string;
  billingCycle: string;
  billingDay: number;
  description?: string | null;
  url?: string | null;
};

/** Cambios realizados en un update: { campo: { from: valor_anterior, to: valor_nuevo } } */
export type SubscriptionChanges = Partial<
  Record<
    keyof SubscriptionSnapshot,
    { from: string | number | null; to: string | number | null }
  >
>;

/** Metadata opcional del evento */
export type EventMetadata = {
  source?: "web" | "api" | "import" | "system";
  ipAddress?: string;
  userAgent?: string;
  note?: string;
};

// Tipos inferidos del audit log
export type SubscriptionEvent = typeof subscriptionEvents.$inferSelect;
export type NewSubscriptionEvent = typeof subscriptionEvents.$inferInsert;
