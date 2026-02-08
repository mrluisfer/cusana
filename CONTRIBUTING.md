# Contributing to Cusana

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/cusana.git
   cd cusana
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Copy the environment file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
5. Push the database schema:
   ```bash
   pnpm db:push
   ```
6. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes
3. Ensure code quality:
   ```bash
   pnpm lint        # Check for lint errors
   pnpm type-check  # Run TypeScript checks
   pnpm format      # Format with Prettier
   pnpm build       # Ensure it builds
   ```
4. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org):
   ```
   feat: add new feature
   fix: resolve bug in calendar
   docs: update README
   refactor: improve query performance
   ```
5. Push to your fork and open a Pull Request

## Branch Naming

| Prefix      | Purpose           |
| ----------- | ----------------- |
| `feat/`     | New features      |
| `fix/`      | Bug fixes         |
| `docs/`     | Documentation     |
| `refactor/` | Code refactoring  |
| `chore/`    | Maintenance tasks |

## Code Style

- **TypeScript** — Strict mode enabled, no `any` types
- **Prettier** — Auto-formatted with Tailwind CSS plugin
- **ESLint** — Next.js core web vitals + TypeScript rules
- **Components** — Use shadcn/ui with Base UI primitives
- **Queries** — Use Drizzle ORM for database operations
- **State** — React Query for server state, Jotai for client state

## Database Changes

If your change requires a schema modification:

1. Update `lib/schema.ts`
2. Generate a migration:
   ```bash
   pnpm db:generate
   ```
3. Include the migration file in your PR

## Reporting Issues

- Use the [issue templates](https://github.com/mrluisfer/cusana/issues/new/choose) when available
- Include steps to reproduce for bug reports
- Provide screenshots for UI-related issues

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
