# BJJ Around ADCC Poland

A modern website listing Brazilian Jiu-Jitsu events happening around ADCC Poland — seminars, open mats, camps, competitions and more.

## Architecture

```
User Browser → Netlify → Next.js App → Supabase (PostgreSQL)
```

- **Frontend**: Next.js 15 App Router with React Server Components
- **Backend**: Supabase PostgreSQL (database only)
- **Mutations**: Next.js Server Actions
- **Hosting**: Netlify with automatic GitHub deployments
- **CI**: GitHub Actions (lint, typecheck, build)

## Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | Next.js 15               |
| Language  | TypeScript               |
| Styling   | Tailwind CSS + shadcn/ui |
| Database  | Supabase PostgreSQL      |
| Hosting   | Netlify                  |
| CI/CD     | GitHub Actions           |

## Local Installation

### Prerequisites

- Node.js 22 LTS
- npm
- Supabase account

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd bjj-around-adcc-poland

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:

   ```
   supabase/migrations/001_create_events.sql
   ```

3. Copy your project URL and keys from **Settings → API**
4. Add them to `.env.local`

### Database Schema

The `events` table stores all event data with Row Level Security enabled. Public users can only read published events. Admin operations use the service role key via Server Actions.

## Admin Panel

Access at `/admin`. Login with the `ADMIN_PASSWORD` environment variable.

Features:

- List all events
- Create, edit, delete events
- Publish/unpublish events

## Netlify Deployment

1. Push the repository to GitHub
2. Connect the repo in [Netlify](https://netlify.com)
3. Netlify auto-detects Next.js via `@netlify/plugin-nextjs`
4. Set environment variables in **Site settings → Environment variables**:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ADMIN_PASSWORD
   ```

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

Build fails if lint, typecheck, or build fails.

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
├── page.tsx                  # Homepage
├── event/[slug]/page.tsx     # Event details
├── admin/                    # Admin panel
components/                   # UI components
lib/                          # Supabase, auth, utils
types/                        # TypeScript types
supabase/migrations/          # Database migrations
```

## Future Improvements

- Image upload to Supabase Storage
- Multi-language support (PL/EN)
- Email notifications for new events
- Event submission form for academies
- Advanced map view with all events
- RSS feed for events
- Analytics integration

## License

Private project.
