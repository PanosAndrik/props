# Deploy PropCompare to production

## Recommended stack

| Service | Purpose |
|---------|---------|
| **Vercel** | Host Next.js app |
| **Neon** or **Supabase** | PostgreSQL database |
| **Your domain** | DNS → Vercel |

SQLite (`dev.db`) is for local development only.

## 1. PostgreSQL database

1. Create a free Postgres database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the connection string (starts with `postgresql://`).

## 2. Update Prisma for production

In `prisma/schema.prisma` change:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then locally (with production `DATABASE_URL` in `.env`):

```powershell
npx prisma migrate deploy
npx prisma db seed
```

## 3. Environment variables on Vercel

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://...` |
| `AUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`) |
| `AUTH_URL` | `https://yourdomain.com` |

## 4. Deploy

1. Push code to GitHub (`main` branch).
2. Import repo in [Vercel](https://vercel.com) → Deploy.
3. Add env vars → Redeploy.
4. Point your domain DNS to Vercel.

## 5. After launch

- Change admin password (`admin@prop.local`) or create a new admin user.
- Add real firms, coupons, and blog posts via `/admin`.
- Monitor reviews at `/admin/reviews`.
