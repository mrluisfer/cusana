import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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
  budgets: many(budgets),
  subscriptionPayments: many(subscriptionPayments),
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
  billingMonth: integer("billing_month"), // 1-12, opcional (para anuales)

  // Estado
  active: boolean("active").notNull().default(true),

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

// ─── Presupuestos mensuales ────────────────────────────────────────────

/**
 * Presupuesto mensual del usuario, una fila por (usuario, moneda, mes).
 *
 * - `period` es siempre el primer día del mes al que aplica (YYYY-MM-01),
 *   lo que da un histórico natural: cada mes guarda su propio presupuesto.
 * - El índice único evita duplicados y permite usar `onConflictDoUpdate`
 *   (upsert) al guardar.
 * - Al persistirse en DB, el presupuesto se sincroniza entre dispositivos.
 */
export const budgets = pgTable(
  "budgets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    currency: currencyEnum("currency").notNull().default("MXN"),

    // Primer día del mes al que aplica este presupuesto (YYYY-MM-01)
    period: date("period").notNull(),

    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("budgets_user_currency_period_idx").on(
      table.userId,
      table.currency,
      table.period,
    ),
    index("budgets_user_idx").on(table.userId),
  ],
);

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(user, {
    fields: [budgets.userId],
    references: [user.id],
  }),
}));

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

// ─── Pagos / cobros de suscripciones ──────────────────────────────────

export const paymentStatusEnum = pgEnum("payment_status", ["paid", "unpaid"]);
export const paymentSourceEnum = pgEnum("payment_source", ["auto", "manual"]);

/**
 * Historial de cobros: una fila por ocurrencia (suscripción + fecha de cobro).
 *
 * - Las ocurrencias cuya fecha ya llegó se registran solas como `paid` con
 *   `source: "auto"` (ver `syncAutoPayments`). Nunca pisan una fila existente,
 *   así que una corrección manual siempre gana.
 * - El usuario puede marcar una ocurrencia como pagada o pendiente
 *   (`source: "manual"`), incluso por adelantado.
 * - `amount` y `currency` son una foto del precio al registrar el cobro, para
 *   que el historial no cambie si después se edita la suscripción.
 * - `subscriptionId` no es FK (igual que en `subscription_events`): el
 *   historial sobrevive a un hard delete de la suscripción.
 */
export const subscriptionPayments = pgTable(
  "subscription_payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    subscriptionId: text("subscription_id").notNull(),

    // Fecha en que corresponde el cobro (YYYY-MM-DD)
    dueDate: date("due_date").notNull(),

    status: paymentStatusEnum("status").notNull(),
    source: paymentSourceEnum("source").notNull(),

    // Día en que se pagó (YYYY-MM-DD); null mientras está pendiente
    paidOn: date("paid_on"),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("sub_payments_subscription_due_idx").on(
      table.subscriptionId,
      table.dueDate,
    ),
    index("sub_payments_user_due_idx").on(table.userId, table.dueDate),
  ],
);

export const subscriptionPaymentsRelations = relations(
  subscriptionPayments,
  ({ one }) => ({
    user: one(user, {
      fields: [subscriptionPayments.userId],
      references: [user.id],
    }),
    subscription: one(subscriptions, {
      fields: [subscriptionPayments.subscriptionId],
      references: [subscriptions.id],
    }),
  }),
);

export type SubscriptionPayment = typeof subscriptionPayments.$inferSelect;
export type NewSubscriptionPayment = typeof subscriptionPayments.$inferInsert;
