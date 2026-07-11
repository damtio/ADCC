# BJJ Around ADCC Poland

A modern website listing Brazilian Jiu-Jitsu events happening around ADCC Poland — seminars, open mats, camps, and more. Includes a Kraków academies directory and a visitor orientation guide for ADCC weekend.

**Production:** [adcc2026.netlify.app](https://adcc2026.netlify.app)

## Architecture

```
User Browser → Netlify → Next.js App → Supabase (PostgreSQL + Storage)
                              ↑
                    GitHub (main → auto-deploy)
```

- **Frontend**: Next.js 15 App Router with React Server Components
- **i18n**: next-intl (`/en`, `/pl` locale prefixes)
- **Backend**: Supabase PostgreSQL + Storage
- **Mutations**: Next.js Server Actions
- **Hosting**: Netlify with automatic GitHub deployments
- **CI**: GitHub Actions (lint, typecheck, build)

## Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 15 (App Router)                  |
| UI           | React 19, Server Components              |
| Language     | TypeScript                               |
| Styling      | Tailwind CSS 4, shadcn/ui (Radix UI)     |
| Icons        | Lucide React                             |
| i18n         | next-intl (English + Polish)             |
| Database     | Supabase PostgreSQL                      |
| File storage | Supabase Storage (`event-images` bucket) |
| Auth (admin) | Cookie session + `ADMIN_PASSWORD`        |
| Hosting      | Netlify (`@netlify/plugin-nextjs`)       |
| CI/CD        | GitHub Actions, Husky, lint-staged       |
| Code quality | ESLint, Prettier, TypeScript strict      |

## Web Structure

### Public routes (localized)

All public pages live under a locale prefix. `/` redirects to `/en`.

| Path                           | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `/en`, `/pl`                   | Homepage — event list, filters, ADCC countdown    |
| `/[locale]/event/[slug]`       | Event detail page                                 |
| `/[locale]/academies`          | BJJ academies in Kraków (from Supabase)           |
| `/[locale]/krakow-orientation` | Static visitor guide (transport, districts, tips) |
| `/[locale]/submit-event`       | Public event submission form                      |

**Locale switching:** EN/PL toggle in the navbar preserves the current page.

**Translated UI:** navigation, labels, filters, orientation content, form labels.

**Not translated:** event and academy content from Supabase (stored as submitted).

### Admin routes (English, no locale prefix)

| Path                         | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `/admin`                     | Login + event dashboard (CRUD, publish/unpublish) |
| `/admin/new`                 | Create event                                      |
| `/admin/edit/[id]`           | Edit event                                        |
| `/admin/submissions`         | Review public event submissions                   |
| `/admin/academies`           | Manage academies                                  |
| `/admin/academies/new`       | Add academy                                       |
| `/admin/academies/edit/[id]` | Edit academy                                      |

### SEO & metadata

| Path           | Description                                   |
| -------------- | --------------------------------------------- |
| `/sitemap.xml` | Sitemap with all locales and published events |
| `/robots.txt`  | Crawling rules (`/admin/` disallowed)         |

### Request flow

```
middleware.ts          → locale detection, / → /en redirect
app/[locale]/layout.tsx → setRequestLocale, metadata
app/layout.tsx         → html shell, Navbar, Footer, NextIntlClientProvider
lib/supabase.ts        → public read (published events, academies)
lib/supabase-admin.ts  → admin write (service role, bypasses RLS)
app/admin/actions.ts   → authenticated Server Actions
```

## Local Installation

### Prerequisites

- Node.js 22 LTS (or compatible)
- npm
- Supabase account

### Setup

```bash
git clone https://github.com/damtio/ADCC.git
cd ADCC

npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/en`.

## Environment Variables

Create `.env.local` from `.env.example`:

| Variable                        | Description                             |
| ------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server only) |
| `ADMIN_PASSWORD`                | Admin panel password                    |

**Never commit secrets to the repository.**

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order in **SQL Editor**:

   ```
   supabase/migrations/001_create_events.sql
   supabase/migrations/002_create_event_images_bucket.sql
   supabase/migrations/003_create_event_submissions.sql
   supabase/migrations/004_fix_event_submissions_columns.sql
   supabase/migrations/005_reload_submissions_schema.sql
   supabase/migrations/006_create_academies.sql
   ```

3. Copy project URL and keys from **Settings → API**
4. Add them to `.env.local` (and Netlify env vars for production)

If you see schema cache errors after DDL changes, run:

```sql
NOTIFY pgrst, 'reload schema';
```

### Database tables

| Table               | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `events`            | Published/draft BJJ events                          |
| `event_submissions` | Public form submissions (pending/approved/rejected) |
| `academies`         | Kraków BJJ academies directory                      |

Row Level Security allows public read of published rows. Admin Server Actions use the service role key.

## Admin Panel

Access at `/admin`. Login with the `ADMIN_PASSWORD` environment variable.

Features:

- Events: list, create, edit, delete, publish/unpublish, image upload
- Submissions: approve (creates draft event) or reject
- Academies: CRUD, publish/unpublish, sort order

## Netlify Deployment

1. Push the repository to GitHub
2. Connect the repo in [Netlify](https://netlify.com)
3. Netlify auto-detects Next.js via `@netlify/plugin-nextjs`
4. Set environment variables in **Site settings → Environment variables**
5. Production deploys trigger on push to `main`
6. Preview deploys are created for pull requests

## GitHub Actions Workflow

The CI pipeline (`.github/workflows/ci.yml`) runs on every PR and push to `main`:

1. Checkout repository
2. Setup Node.js LTS
3. Install dependencies
4. Run ESLint
5. Run TypeScript checking
6. Build Next.js application

## Git Workflow

- `main` — production branch
- `feature/*` — development branches

### Pre-commit Hooks

Husky + lint-staged run before each commit:

- Prettier formatting
- ESLint checks

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add event filtering
fix: correct date formatting
docs: update README
```

## Project Structure

```
app/
├── [locale]/                    # Public pages (i18n)
│   ├── layout.tsx               # Locale validation, metadata
│   ├── page.tsx                 # Homepage
│   ├── event/[slug]/            # Event details
│   ├── academies/               # Academies directory
│   ├── krakow-orientation/      # Visitor guide
│   └── submit-event/            # Submission form
├── admin/                       # Admin panel (no locale)
│   ├── actions.ts               # Server Actions
│   ├── academies/               # Academy CRUD
│   └── submissions/             # Submission moderation
├── submit-event/actions.ts      # Public submission action
├── layout.tsx                   # Root layout (Navbar, Footer)
├── sitemap.ts
└── robots.ts

components/                      # UI components
├── ui/                          # shadcn/ui primitives
├── Navbar.tsx                   # Nav + hamburger + language switcher
└── ...

i18n/                            # next-intl config
├── routing.ts                   # locales: en, pl
├── request.ts
└── navigation.ts                # Locale-aware Link, redirect

messages/
├── en.json                      # English translations
└── pl.json                      # Polish translations

lib/                             # Supabase, auth, forms, utils
types/                           # TypeScript interfaces
supabase/migrations/             # SQL migrations
middleware.ts                    # Locale routing
```

## Editing translations

UI strings and orientation content live in:

- `messages/en.json`
- `messages/pl.json`

After changing copy, no database migration is needed — redeploy or restart dev server.

## Future Improvements

- Bilingual fields for events/academies in Supabase
- Email notifications for new submissions
- Advanced map view with all events and academies
- RSS feed for events
- Analytics integration

## License

Private project.
