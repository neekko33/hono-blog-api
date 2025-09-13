To develop locally:

1. [Vercel CLI](https://vercel.com/docs/cli) installed globally
2. Create a new database in PostgreSQL.
3. Copy `.env.example` and rename it to `.env`.
4. Update the `DATABASE_URL` in your `.env` file with your database configuration.

```
npm install
npx drizzle-kit migrate
vc dev
```

```
open http://localhost:3000
```

To build locally:

```
npm install
vc build
```

To deploy:

```
npm install
vc deploy
```
