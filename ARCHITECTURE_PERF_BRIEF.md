# wolnamata.pl — Architecture & Performance Brief

> **Purpose:** Single source of truth for an external AI / engineer to understand the stack, request paths, and speed up the site.
> **Product:** BJJ events + academies directory around ADCC 2026 Kraków — https://wolnamata.pl
> **Repo name:** `bjj-around-adcc-poland` / ADCC
> **Generated for analysis:** 2026-08-12

---

## 1. One-sentence summary

Next.js 15 App Router site on **Netlify**, data/auth/storage on **Supabase**, bilingual PL/EN via **next-intl**. Public event/academy pages are currently **`force-dynamic`** (SSR every request + live Supabase query). Event search/filters run **client-side** after one full events fetch.

---

## 2. Goals for performance work

Primary user journey to optimize:

1. Open homepage → see upcoming events quickly
2. Filter/search events (category, city, date, text)
3. Open event detail → image + actions (maps, register, share, calendar)
4. Browse academies

Expected concurrent load: **~50–100 users** browsing/filtering (ADCC weekend). Dataset is small (dozens of events, ~10 academies).

**Do not** treat this as a high-QPS API problem. Biggest wins are **HTML caching (ISR)**, **image delivery**, and reducing **middleware/auth work on public pages**.

---

## 3. Infrastructure

| Layer                | Technology                             | Notes                                                   |
| -------------------- | -------------------------------------- | ------------------------------------------------------- |
| Frontend / SSR       | Next.js 15.2 + React 19                | App Router                                              |
| Hosting              | Netlify + `@netlify/plugin-nextjs`     | `netlify.toml`, Node 22                                 |
| DNS / TLS            | Netlify DNS (historically)             | Domain: wolnamata.pl                                    |
| Database             | Supabase Postgres                      | Project: ADCC2026                                       |
| Auth                 | Supabase Auth (email + Google OAuth)   | Separate from admin password auth                       |
| Storage              | Supabase Storage bucket `event-images` | Public URLs for event images                            |
| Email (auth confirm) | Resend via Supabase Custom SMTP        | `noreply@wolnamata.pl`                                  |
| Analytics            | Google Analytics `G-J7DBDKW4MP`        | `components/GoogleAnalytics.tsx`                        |
| i18n                 | next-intl                              | Locales: `pl` (default), `en`; `localePrefix: "always"` |

### Env vars (conceptual)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
URL (optional; production site URL for absolute links)
```

Admin panel uses cookie session + `ADMIN_PASSWORD` (`lib/auth.ts`), **not** Supabase Auth.

---

## 4. High-level request flow

```
Browser
  → Netlify Edge / Next middleware (next-intl + Supabase session refresh)
  → Next.js route (often force-dynamic Server Component)
  → Supabase JS client (anon for public reads; service role for mutations)
  → Postgres / Auth / Storage
  → HTML + client hydration (EventList filters in browser)
```

### Middleware (`middleware.ts`)

Runs on almost all non-static paths:

1. Skip session refresh on `/auth/callback`
2. Forward OAuth `?code=` from locale roots to `/auth/callback`
3. For `/auth` and `/admin`: `updateSession` only
4. Else: next-intl routing + `updateSession` (Supabase cookie refresh)

**Perf note:** Public homepage still runs Supabase session middleware even for anonymous visitors.

---

## 5. App routes (map)

### Public (locale-prefixed: `/pl/...`, `/en/...`)

| Route                          | File                                 | Data                      | Caching today   |
| ------------------------------ | ------------------------------------ | ------------------------- | --------------- |
| `/[locale]`                    | `app/[locale]/page.tsx`              | `getPublishedEvents()`    | `force-dynamic` |
| `/[locale]/event/[slug]`       | `app/[locale]/event/[slug]/page.tsx` | `getEventBySlug(slug)`    | `force-dynamic` |
| `/[locale]/academies`          | `app/[locale]/academies/page.tsx`    | `getPublishedAcademies()` | `force-dynamic` |
| `/[locale]/krakow-orientation` | orientation static content           | mostly static messages    | check page      |
| `/[locale]/submit-event`       | submission form                      | writes via server action  | —               |
| `/[locale]/login`, `/register` | AuthForm                             | Supabase Auth             | —               |
| `/[locale]/my-events/*`        | user event CRUD                      | service role + `user_id`  | auth required   |
| `/[locale]/my-academies/*`     | user academy CRUD                    | service role + `user_id`  | auth required   |

### Non-locale

| Route                             | Purpose                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| `/auth/callback`                  | OAuth / email code exchange                                |
| `/admin/*`                        | Password-gated admin CRUD (events, academies, submissions) |
| `app/sitemap.ts`, `app/robots.ts` | SEO                                                        |

---

## 6. Data layer

### Public reads — `lib/supabase.ts`

- `createSupabaseClient()` — anon key browser/server public client
- `getPublishedEvents()` — `select *` where `published=true`, order `date`, `start_time`, then `sortEventsChronologically()`
- `getEventBySlug(slug)` — single published event
- `getPublishedAcademies()` — published academies by `sort_order`, `name`

### Mutations — service role

- `lib/supabase-admin.ts` — `createSupabaseAdmin()`
- Used by: `app/admin/actions.ts`, `app/[locale]/my-events/actions.ts`, `app/[locale]/my-academies/actions.ts`, `app/submit-event/actions.ts`
- After writes: `revalidatePath("/")` etc. (path revalidation exists, but pages are still force-dynamic so cache benefit is limited)

### Filtering — client only

- `components/EventList.tsx` (client): holds search/category/city/date state
- `lib/filters.ts`: `filterEvents`, `getUniqueCities`, `getUniqueDates`
- Filtering does **not** hit the network after initial page load

### Sorting

- `lib/utils.ts`: `sortEventsChronologically` — date → start_time → title
- Applied in fetchers and after client filter

### Maps links

- `lib/event-links.ts`: `buildEventMapsUrl` uses **text address** (`academy + address + city`), **not** lat/lng
- Same pattern as Academies cards

### Slugs

- `lib/utils.ts` `slugify`
- `lib/event-slug.ts` `resolveUniqueEventSlug` — avoids unique constraint `event_slug_key` collisions

---

## 7. Database schema (essentials)

Migrations live in `supabase/migrations/` (`001`…`010`).

### `events`

Key columns: `id`, `slug` UNIQUE, `title`, `category`, `description`, `instructor`, `organizer`, `academy`, `city`, `address`, `latitude`, `longitude`, `date`, `end_date` (migration 010), `start_time`, `end_time`, `price`, `currency`, `registration_url`, `facebook_url`, `instagram_url`, `image_url`, `published`, `user_id` (007), timestamps.

Indexes: `published`, `date`, `slug`, `user_id`.

RLS: public SELECT where `published=true`; owners can CRUD own rows (007).

### `academies`

Directory + user-owned academies: `name`, `address`, `district`, `city`, `specialization`, social URLs, geo, `sort_order`, `published`, `user_id`.

### `event_submissions`

Public “submit event” flow; admin approve/reject → insert into `events`.

### Storage

Bucket `event-images` (public read). Upload via service role / authenticated policies.

**Typical data volume:** ~20–40 published events (incl. many Unity open-mat slots), handful of academies. Full `select *` of events is fine size-wise; latency is network/SSR, not row count.

---

## 8. Frontend components (hot path)

| Component                      | Role                             | Perf relevance                                             |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------- |
| `EventList`                    | Filters + grid                   | Client filter OK; ships all events in RSC payload          |
| `EventCard`                    | Card UI + image + action buttons | Many `next/image` per viewport                             |
| `Filters` / `SearchBox`        | UI controls                      | Local state only                                           |
| `EventForm` / `SubmissionForm` | Create/edit                      | Admin/user only                                            |
| `AcademyCard` / `AcademyList`  | Academies                        | Similar card pattern, no mini-map                          |
| `Navbar` / `AuthNav`           | Nav + auth state                 | AuthNav client calls `getUser`                             |
| `WhatsAppCommunityPopup`       | Modal                            | Client                                                     |
| `Countdown`                    | ADCC countdown                   | Client                                                     |
| `MapPreview`                   | Leaflet-style embed              | **Removed from event detail**; file may still exist unused |

Event detail page: hero image, meta grid, action buttons (maps/register/social/calendar/share), description. No map embed.

UI: Tailwind 4, shadcn-like `components/ui/*`, dark theme.

Font: **Inter** from `next/font/google` in root layout (all pages).

---

## 9. Auth model (two systems)

1. **Site users** — Supabase Auth (email/password + Google). Manage `/my-events`, `/my-academies`.
2. **Admin** — shared password → HTTP-only cookie (`lib/auth.ts`). `/admin` only.

Do not mix them when optimizing. Public pages should ideally avoid auth cookie refresh cost when possible.

---

## 10. Known performance bottlenecks (prioritized)

### P0 — No HTML cache on public pages

```ts
export const dynamic = "force-dynamic";
```

Present on:

- `app/[locale]/page.tsx` (homepage — critical)
- `app/[locale]/event/[slug]/page.tsx`
- `app/[locale]/academies/page.tsx`
- plus all `/admin/*` (OK to stay dynamic)

**Effect:** Every homepage hit = Netlify SSR function + Supabase round-trip. Cold starts hurt TTFB.

**Recommended fix:** Replace with ISR, e.g. `export const revalidate = 60` (or 300), keep `revalidatePath` on mutations. Optionally `unstable_cache` / `cache` around `getPublishedEvents`.

### P1 — Middleware refreshes Supabase session on every public request

Anonymous users still pay session cookie work.

**Options:** Skip `updateSession` for known public paths without auth cookies; or only refresh when Supabase auth cookie present.

### P2 — Images

- Stored in Supabase Storage (often PNG, up to 5 MB allowed)
- `next.config.ts` allows `hostname: "**"` (loose)
- Cards load many images in a grid; desktop image is clickable overlay
- No explicit image CDN beyond Next Image optimizer on Netlify

**Options:** compress uploads, prefer WebP, tighter `sizes`, priority only LCP image, consider Supabase image transforms or Netlify Image CDN settings.

### P3 — Over-fetching

`getPublishedEvents()` uses `select("*")`. For list cards only need: `id, slug, title, category, date, end_date, start_time, end_time, city, address, academy, organizer, price, currency, image_url, registration_url, facebook_url, instagram_url`.

### P4 — Client bundle / JS

Homepage hydrates EventList + filters + auth nav + WhatsApp popup + GA. Acceptable for 50–100 users; still worth code-splitting heavy widgets if measuring LCP/INP.

### P5 — Paid plans

Paying Netlify alone won't fix force-dynamic TTFB. Paying Supabase helps if free project pauses / throttles. **Code caching > paid upgrades** for this app size.

---

## 11. What already works well

- Client-side filtering after one fetch (search does not spam DB)
- Chronological sort (date + time) for same-day slots (Unity open mats)
- `revalidatePath` wired on create/update/delete/publish
- Dataset small enough for single query
- Map links use address text (predictable Google search)
- i18n messages split `messages/pl.json`, `messages/en.json`

---

## 12. Suggested optimization plan (for implementing AI)

### Phase A — biggest win, low risk

1. On public pages remove `force-dynamic`.
2. Add `export const revalidate = 60` (tune 30–300).
3. Ensure mutation actions call `revalidatePath` for `/`, `/[locale]`, `/event/[slug]`, `/academies` (and locale variants if needed under next-intl).
4. Optionally wrap `getPublishedEvents` / `getPublishedAcademies` / `getEventBySlug` with Next `cache()` or `unstable_cache` tags.

### Phase B — middleware

5. Avoid Supabase session refresh when no auth cookies on public marketing routes.

### Phase C — images & payload

6. Narrow `select` columns for list endpoints.
7. Compress seed/uploaded images; enforce WebP where possible.
8. Set `priority` on first visible card/hero only; lazy elsewhere (default).

### Phase D — measure

9. Measure TTFB / LCP on `/pl` before & after (WebPageTest or Chrome UX).
10. Confirm Netlify function invocations drop after ISR.

### Out of scope unless asked

- Migrating to OCI
- Moving off Supabase
- Paying Netlify/Supabase as first step

---

## 13. Key file index (for navigation)

```
middleware.ts
netlify.toml
next.config.ts
package.json
i18n/routing.ts
i18n/request.ts
i18n/navigation.ts
app/layout.tsx
app/[locale]/layout.tsx
app/[locale]/page.tsx                 # homepage + EventList
app/[locale]/event/[slug]/page.tsx    # event detail
app/[locale]/academies/page.tsx
app/[locale]/my-events/actions.ts
app/[locale]/my-academies/actions.ts
app/admin/actions.ts
app/submit-event/actions.ts
app/auth/callback/route.ts
lib/supabase.ts                       # public reads
lib/supabase-admin.ts
lib/supabase/client.ts | server.ts | middleware.ts
lib/filters.ts
lib/utils.ts                           # slugify, dates, chronological sort
lib/event-slug.ts
lib/event-links.ts                     # maps URL by address
lib/storage.ts
lib/auth.ts                            # admin password session
lib/event-form.ts | academy-form.ts
components/EventList.tsx | EventCard.tsx | Filters.tsx
components/AcademyList.tsx | AcademyCard.tsx
components/AuthForm.tsx | AuthNav.tsx | Navbar.tsx
types/event.ts | academy.ts | submission.ts
messages/pl.json | en.json
supabase/migrations/*.sql
```

---

## 14. Example current homepage data path (pseudo)

```ts
// app/[locale]/page.tsx
export const dynamic = "force-dynamic"; // ← remove for ISR

export default async function HomePage() {
  const events = await getPublishedEvents(); // select * from events where published
  return <EventList events={events} />;      // client filters locally
}
```

```ts
// lib/supabase.ts
.from("events").select("*").eq("published", true)
.order("date").order("start_time")
→ sortEventsChronologically(data)
```

---

## 15. Constraints / product rules to preserve while optimizing

- Default locale **Polish** (`pl`)
- Admin remains separate from user Auth
- Event categories include Tournament, Seminar variants, Camp, Afterparty, Open Mat
- Multi-day events use `end_date`
- Unique event slugs (especially many Unity slots with same title)
- Maps buttons must use **address text**, not coordinates
- Event cards: no embedded map; equal-size action buttons (maps / register / social / details)
- Do not break Netlify deploy (`@netlify/plugin-nextjs`)

---

## 16. Success metrics

After changes, expect:

- Homepage TTFB much lower on repeat views (cached HTML)
- Supabase reads for public pages drop sharply under 50–100 concurrent browsers
- Filtering UX unchanged (still instant client-side)
- Content updates visible within `revalidate` window or immediately after `revalidatePath`

---

## 17. Prompt hint for implementing AI

> Optimize wolnamata.pl for faster public event browsing. Keep Supabase + Netlify. Prefer ISR/`revalidate` over force-dynamic on public routes, reduce middleware auth work for anonymous users, and tighten event list queries/images. Preserve i18n, auth model, and address-based map links. Dataset is small; target 50–100 concurrent visitors.

End of brief.
