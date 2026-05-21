# PropCompare — Prop Firm Platform

Local development project (Next.js + Prisma + SQLite).

## Quick start

```powershell
cd C:\Projects\prop-platform
npm install
copy .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000

### Demo accounts (after seed)

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@prop.local   | admin123  |
| User  | demo@prop.local    | demo123   |

## Public site

- **Home** — stats + featured firms
- **/firms** — list with search, asset filter, featured filter
- **/firms/[slug]** — firm detail + reviews (login to submit)
- **/compare** — pick 2–3 firms, side-by-side table
- **/blog** — published posts

## Admin panel (`/admin`)

Requires **ADMIN** role. Sidebar: Dashboard, Firms, Blog, Reviews.

| Section   | Features |
|-----------|----------|
| Dashboard | Stats, recent pending reviews, quick actions |
| Firms     | List, add, edit, delete, featured/published toggles |
| Blog      | List, create, edit, delete, publish draft |
| Reviews   | All reviews, filter by status, approve/reject |

## GitHub — checkpoints

```powershell
git add .
git status
git commit -m "Describe what you changed"
git push
```

Remote: https://github.com/PanosAndrik/props.git

## Docker Postgres (optional, production)

```powershell
docker compose up -d
```

Set `DATABASE_URL` to Postgres and change `provider` in `prisma/schema.prisma` to `postgresql`, then `npx prisma migrate dev`.

## Production (later)

- Host on **Vercel** + **Neon/Supabase** Postgres
- Set `AUTH_SECRET`, `AUTH_URL`, `DATABASE_URL` in hosting env
