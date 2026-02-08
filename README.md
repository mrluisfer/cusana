# Track0

A modern subscription tracker built with Next.js 16, designed to help you monitor, manage, and analyze all your recurring expenses in one place.

## Features

- **Subscription Management** — Add, edit, and delete subscriptions with real-time updates
- **Multi-Currency Support** — Track subscriptions in different currencies with automatic conversion via Frankfurter API
- **Dashboard Analytics** — Spending distribution, billing calendar, and monthly trend charts
- **Export Data** — Download your data as Excel (.xlsx), CSV, or JSON
- **Audit Log** — Full event history for every subscription change (create, update, delete)
- **Authentication** — Email/password and OAuth (Google, GitHub) via Better Auth
- **Responsive Design** — Fully responsive UI built with shadcn/ui and Base UI

## Tech Stack

| Layer      | Technology                                                                      |
| ---------- | ------------------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router)                                   |
| Language   | [TypeScript](https://typescriptlang.org)                                        |
| Database   | [Neon](https://neon.tech) (Serverless PostgreSQL)                               |
| ORM        | [Drizzle](https://orm.drizzle.team)                                             |
| Auth       | [Better Auth](https://www.better-auth.com)                                      |
| UI         | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com)             |
| State      | [TanStack React Query](https://tanstack.com/query) + [Jotai](https://jotai.org) |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com)                                      |
| Validation | [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com)         |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 9
- A [Neon](https://neon.tech) database (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/mrluisfer/track0.git
cd track0

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Environment Variables](#environment-variables) for details.

```bash
# Push the database schema
pnpm db:push

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable                      | Required | Description                                           |
| ----------------------------- | -------- | ----------------------------------------------------- |
| `DATABASE_URL`                | Yes      | Neon PostgreSQL connection string                     |
| `BETTER_AUTH_SECRET`          | Yes      | Auth secret — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL`             | Yes      | Base URL of your app (e.g. `http://localhost:3000`)   |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Yes      | Public base URL (same as above)                       |
| `GOOGLE_CLIENT_ID`            | No       | Google OAuth client ID                                |
| `GOOGLE_CLIENT_SECRET`        | No       | Google OAuth client secret                            |
| `GITHUB_CLIENT_ID`            | No       | GitHub OAuth client ID                                |
| `GITHUB_CLIENT_SECRET`        | No       | GitHub OAuth client secret                            |

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `pnpm dev`         | Start development server     |
| `pnpm build`       | Build for production         |
| `pnpm start`       | Start production server      |
| `pnpm lint`        | Run ESLint                   |
| `pnpm type-check`  | Run TypeScript type checking |
| `pnpm format`      | Format code with Prettier    |
| `pnpm db:generate` | Generate Drizzle migrations  |
| `pnpm db:push`     | Push schema to database      |
| `pnpm db:migrate`  | Run pending migrations       |
| `pnpm db:studio`   | Open Drizzle Studio          |

## Project Structure

```
track0/
├── app/
│   ├── (auth)/               # Auth pages (login, register)
│   ├── (protected)/          # Authenticated routes
│   │   └── dashboard/
│   │       └── components/
│   │           ├── resume/   # Dashboard summary cards
│   │           └── subscriptions/ # Data table & actions
│   └── api/                  # API routes
├── components/
│   ├── dashboard/            # Shared dashboard components
│   └── ui/                   # shadcn/ui components
├── constants/                # App constants (icons, currencies)
├── hooks/                    # Custom React hooks
├── lib/
│   ├── auth.ts              # Better Auth configuration
│   ├── db.ts                # Drizzle + Neon client
│   ├── schema.ts            # Database schema
│   └── queries/             # Database query helpers
├── utils/                    # Utility functions
└── drizzle/                  # Migrations
```

## Deployment

The recommended deployment target is [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add your environment variables
4. Deploy

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
