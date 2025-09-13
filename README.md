## About

A blog API built with hono.js and deployed on Vercel.

## How to run

1. [Vercel CLI](https://vercel.com/docs/cli) installed globally
2. Create a new database in PostgreSQL.
3. Copy `.env.example` and rename it to `.env`.
4. Update the `DATABASE_URL` in your `.env` file with your database configuration.

```
npm install
npm run db:push
npm run dev
```