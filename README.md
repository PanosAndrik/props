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

## GitHub — checkpoints (αλλαγές)

Το project είναι ήδη Git repo. Κάθε σημαντική αλλαγή:

```powershell
git add .
git status
git commit -m "Describe what you changed"
git push
```

### Πρώτη σύνδεση με GitHub

1. Δημιούργησε **κενό** repo στο GitHub (χωρίς README) — π.χ. `prop-platform`
2. Στο PC:

```powershell
cd C:\Projects\prop-platform
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prop-platform.git
git push -u origin main
```

Αντικατέστησε `YOUR_USERNAME` και το όνομα του repo.

### Με GitHub CLI (προαιρετικό)

```powershell
winget install GitHub.cli
gh auth login
gh repo create prop-platform --private --source=. --push
```

## Docker Postgres (optional)

```powershell
docker compose up -d
```

Then set in `.env`:

```
DATABASE_URL="postgresql://prop:prop_local_dev@localhost:5432/prop_platform"
```

And change `provider` in `prisma/schema.prisma` to `postgresql`, then `npx prisma migrate dev`.

## What is included

- Sign up / Sign in
- Prop firms list & detail pages
- Reviews (login required, admin approval)
- Blog
- Admin panel (approve/reject reviews)
