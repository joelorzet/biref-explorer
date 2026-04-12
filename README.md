# Biref Explorer

**The visual workbench for [`@biref/scanner`](https://www.npmjs.com/package/@biref/scanner).**

Point it at any Postgres database. Biref Explorer scans every table,
walks every relationship (in **both** directions), and gives you a
clean UI to browse your schema and build typed queries without
writing a single line of SQL.

If you have ever wanted a Prisma-style query builder that works on a
database you did not design, this is it.

## What you can do with it

### Scan any database in seconds

Paste a connection string (or fill the fields), pick Postgres, and
hit Connect. Biref opens one server-side connection, walks the entire
schema, and hands you the full model: every entity, every column,
every index, and every foreign key, resolved in both directions.

### Browse your schema visually

A filterable sidebar groups every table by namespace. Click one and
you get:

- The column list with type chips, null-ability, identifiers, and
  native types.
- **Outbound** relationships (the foreign keys this table holds).
- **Inbound** relationships (the foreign keys that point at this
  table). This is the thing most schema tools silently miss.
- Indexes and constraints.

### Build queries by clicking

Pick a table, toggle the fields you want, add `where` clauses with
operator-aware value inputs, and dive through relationships with a
recursive include picker. Every selector is driven off the scanned
model, so you can only pick things that actually exist.

- `findMany` or `findFirst`
- Explicit limit with a one-click "no limit" clear
- Nested includes as deep as your schema goes
- Add individual relations or `* all` of them at once

### Read results in a real JSON viewer

Results come back in a collapsible JSON tree:

- Search by key, value, or both. Matching keys and values are
  highlighted inline, and parent nodes auto-expand around hits.
- One click to collapse any subtree.
- A copy-raw-JSON button for pasting into another tool.
- Safe with `bigint`, `Date`, `Buffer`, and other Postgres types
  that `JSON.stringify` would normally choke on.

### Ship a typed schema file

Switch to the Codegen tab and the scanner generates a
`biref.schema.ts` for you on the spot. Import `BirefSchema` in your
own project and every `.select()`, `.where()`, and `.include()` gets
full editor autocomplete and return-type narrowing based on the live
database.

Copy it to your clipboard or download it straight from the UI.

### Stay in the loop

Every async action (connect, scan, codegen, query, copy) runs
through a toast notifier so you always know what is happening. No
silent failures, no spinners without context.

## Quick start

Requirements:

- Node.js 20.12 or later
- A reachable Postgres database

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

On the first screen:

1. Pick the **Postgres** driver.
2. Paste a connection string (`postgres://user:password@host:5432/mydb`)
   or switch to **Fields** mode.
3. Choose **Runtime scanner** (query the database directly) or
   **Codegen** (generate a typed schema file).
4. Hit **Connect**. You can also press **Enter** from anywhere on
   the page.

That is it. Biref scans your database, and you land in the explorer
with the sidebar full of your tables.

Credentials never leave the Next.js server process. The browser only
ever talks to the API routes running under this same app.

## Scripts

```bash
npm run dev          # Dev server on http://localhost:5173
npm run build        # Production build
npm run start        # Start the production build

npm run lint         # Biome lint
npm run lint:fix     # Biome lint with autofix
npm run format       # Biome format write
npm run check        # Biome lint + format + import sorting
npm run check:fix    # Biome check with autofix

npm run typecheck    # tsc --noEmit
npm run verify       # typecheck + biome check (CI target)
```

## Supported databases

| Driver | Status |
| --- | --- |
| Postgres | **Available** |
| MySQL | Planned |
| SQLite | Planned |
| MongoDB | Planned |

The backend uses a strategy pattern, so adding a new database is a
matter of implementing a single `DriverStrategy` file and
registering it. No changes to the UI or the API routes are needed.

## Tech stack

- Next.js 14 (App Router)
- React 18 + TypeScript (strict)
- Tailwind CSS (dark developer theme)
- Biome for linting and formatting
- Yup for form validation
- Sileo for notifications
- `@biref/scanner` for introspection and typed queries

## Project layout

```
src/
  app/                # Next.js App Router: pages + API routes
  components/         # Presentational UI (connection, schema,
                      #   query builder, JSON viewer, codegen)
  hooks/              # All state, effects, and derivations live here
  lib/
    container/        # Client and server dependency containers
    services/         # HTTP client, scanner service, notifications,
                      #   driver strategies
    utils/            # Pure helpers (jsonSafe, relationNaming)
shared/
  api.ts              # Request and response DTOs shared across the wire
```

## License

MIT.
