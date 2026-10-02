# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build — runs prebuild: icons:check && type-check
pnpm type-check       # tsc --noEmit
pnpm lint             # oxlint && oxfmt --check  (lint + format/import/class-order check)
pnpm lint:fix         # oxlint --fix && oxfmt
pnpm format           # oxfmt  (formats, sorts imports and Tailwind classes)
pnpm icons:fix        # Namespace short SVG ids in assets/icons (see "Brand icons")

pnpm db:push          # Push schema to Neon (dev)
pnpm db:generate      # Generate migration from lib/schema.ts
pnpm db:migrate       # Apply pending migrations
pnpm db:studio        # Drizzle Studio
```

**There is no test suite** — no test runner is installed and CI (`.github/workflows/ci.yml`) runs only `lint`, `type-check`, and `build`. Don't invent a test command; verify changes with `pnpm type-check && pnpm build`.

Tooling is **Oxc**: `oxlint` for linting (`.oxlintrc.json`) and `oxfmt` for formatting (`.oxfmtrc.json`); it replaced Biome. Versions are pinned exactly because `oxfmt` is still 0.x and its output can shift between releases.

- **oxlint** runs **type-aware** (`options.typeAware`, powered by `oxlint-tsgolint`, which needs TypeScript 7), so rules like `typescript/no-floating-promises` are errors: mark intentionally un-awaited promises (e.g. `queryClient.invalidateQueries`) with `void`. Only the `correctness` category is on, plus a few explicit rules; `react/purity`, `react/set-state-in-effect` and `react/no-array-index-key` are warnings. `jsx-a11y` is enabled through an override that excludes `components/ui/**`, and that directory also relaxes `react/no-danger` and `restrict-template-expressions`, because the shadcn CLI regenerates it. Oxlint can't disable a whole plugin inside an override, which is why a11y is opted in rather than opted out.
- `scripts/oxlint-plugin-drizzle.mjs` is a local JS plugin that flags `db.delete()` / `db.update()` chains without `.where()`. The upstream `eslint-plugin-drizzle` can't load here (it needs `@typescript-eslint/utils`, which doesn't support TS 7).
- `@shadcn/lint` (design-system rules for Tailwind) is registered in `jsPlugins` but **no `shadcn/*` rules are enabled yet**. It discovers components and the theme from `components.json` (`@/components/ui`, `app/globals.css`), so `settings.shadcn` isn't needed. Add rules under `rules` in `.oxlintrc.json`; `no-restyle` should be turned off for `components/ui/**` via an override, because that directory defines the components themselves.
- Suppressions use `// oxlint-disable-next-line <plugin>/<rule> -- reason`. `react-hooks/exhaustive-deps` reports on the usage or dependency-array line, not on the hook call, so wrap the whole hook in `// oxlint-disable …` / `// oxlint-enable …` instead. Check with `pnpm exec oxlint --report-unused-disable-directives`.
- **oxfmt** is Prettier-compatible. It also sorts imports (`sortImports`: external → `@/` → relative, no blank lines inserted, and an existing blank line starts a new sorted block) and Tailwind classes (`sortTailwindcss`, which reads the theme from `app/globals.css` and also sorts inside `cn`/`clsx`/`cva`/`twMerge` and the `triggerClassName` prop). The class sorter splits on whitespace, so an arbitrary value must not contain literal spaces: use `_` or `%20` inside a data URI. `pnpm-workspace.yaml` and `pnpm-lock.yaml` are ignored because pnpm rewrites them.

## Architecture

Next.js 16 App Router + Neon Postgres via Drizzle + Better Auth. Path alias `@/*` maps to the repo root.

### Request flow

Client components fetch through React Query → `app/api/[userid]/…/route.ts` → `lib/queries/*` → Drizzle. Route handlers are thin; all DB access and business rules live in `lib/queries/`.

**Route handlers trust the `userid` path segment.** They do not call `getSession()`, and `proxy.ts` (Next 16's renamed middleware) does not match `/api/*` — its matcher only covers page routes. Authorization is therefore effectively absent on the data API. Keep this in mind before assuming a handler is protected, and prefer adding a session check over widening the pattern.

`lib/db.ts` exports `db` as a lazy `Proxy` that only constructs the Neon client on first property access. This is what lets `pnpm build` succeed without `DATABASE_URL` set.

### Subscriptions and the audit log

`subscriptions` mutations in `lib/queries/subscriptions.ts` automatically append to `subscription_events`, an **append-only audit table** — never update or delete rows in it. Each event stores a full `snapshot` plus a `changes` diff for updates. Call the existing query helpers rather than writing to `subscriptions` directly, or the history silently loses events.

`deleteSubscription` is a **soft delete** (`active: false`); `hardDeleteSubscription` removes the row but keeps its events. `GET /api/[userid]/subscription?status=inactive` returns soft-deleted rows.

### Money, currency and periods

- `price` is a Postgres `numeric` and arrives as a **string** — always `Number.parseFloat(String(price))`.
- Prices are stored in their **original** currency. `getMonthlyAmount()` in `utils/subscription-insights.ts` normalizes yearly → monthly; `convertToTarget()` converts using a Frankfurter rate map and returns `null` when a rate is missing (callers must handle it).
- Exchange rates come from the public Frankfurter API, fetched **per component** on the client (and in two API routes) — there is no shared rates module.
- Budgets are keyed by "period", the first day of a month as `YYYY-MM-01`. Use the helpers in `lib/period.ts` rather than formatting dates by hand.
- Next-billing math lives in `utils/get-next-billing-date.tsx`; sort by `getNextBillingDateFull().getTime()`, not by `billingDay`, or yearly cycles order incorrectly.

### State

- **Server state**: React Query. Keys come from the `QueryKeys` enum in `constants/query-keys.ts`. Note the same endpoint is cached under two shapes — `[QueryKeys.SUBSCRIPTIONS, userId]` (via `hooks/use-subscriptions.ts`) and `[QueryKeys.SUBSCRIPTIONS, "list"]` (dashboard cards). Prefix invalidation on `[QueryKeys.SUBSCRIPTIONS]` covers both.
- **UI state**: Jotai atoms in the root `atoms.ts` (selected currency, AI chat / command palette visibility, table filters, calendar hover preference). Persisted preferences use `atomWithStorage`.

### i18n

`react-i18next` with `es` as the default locale. `lib/i18n/resources.ts` derives the translation type from **`es.json`** (`TranslationResource = typeof es`), so a key added only to `en.json` is a type error, and one added only to `es.json` typechecks while rendering the raw key in English. Add keys to both. Language changes go through `useLanguage()` (`lib/i18n/use-language.ts`), which is the single entry point — it writes a cookie so the server can pick the locale up on the next request, plus localStorage and `<html lang>`.

### UI layer

shadcn/ui components in `components/ui/` are built on **Base UI**, not Radix. The composition prop is `render={<Element />}`, not `asChild`. Treat this directory as vendored: prefer regenerating via the shadcn CLI over hand-editing.

`@tanstack/react-table` is **v9**, whose API differs sharply from the v8 examples found online: features must be registered explicitly via `tableFeatures()` (see `app/(protected)/dashboard/components/subscriptions/table-features.ts`), the hook is `useTable` (not `useReactTable`), row models are feature slots (`createFilteredRowModel()` etc.), core types take `TFeatures` as their first generic, and `table.getState()` is replaced by `table.state`. A missing method almost always means an unregistered feature.

### Brand icons

`assets/icons/*.tsx` are hand-vendored SVG components. Many arrive from svgl with short, colliding ids (`url(#a)`), which makes gradients bleed between icons rendered on the same page. `scripts/namespace-svg-ids.mjs` prefixes them with the filename; `pnpm icons:check` runs in `prebuild` and **fails the build** if an unprefixed short id exists. After adding an icon, run `pnpm icons:fix`. Register it in `constants/icons.ts` (which also assigns the service category used by charts and insights).

### AI chat

The assistant is **bring-your-own-key**: the user's OpenAI key is held in `sessionStorage` (`hooks/use-ai-chat.ts`) and `lib/ai-chat/openai-stream.ts` streams directly from the browser to `api.openai.com`. No key ever reaches the server, and there is no backend route for it. `components/ai-chat/ai-chat-panel.tsx` is a fixed side panel whose open state lives in a Jotai atom; `AiChatLayout` shifts dashboard content with a right margin when open.
