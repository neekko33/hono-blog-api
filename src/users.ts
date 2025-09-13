import { Hono } from 'hono'
import { usersTable } from './db/schema.js'
import { db } from './db/db.js'

const app = new Hono()

app.get('/', async (c) => {
  const users = await db.select().from(usersTable)
  return c.json(users)
})

app.post('/', async (c) => {
  const newUser = await c.req.json()
  const inserted = await db.insert(usersTable).values(newUser).returning()
  return c.json(inserted)
})

export default app