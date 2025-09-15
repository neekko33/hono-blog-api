import { Hono } from 'hono'
import { tagsTable } from '../db/schema.js'
import { db } from '../db/db.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

app.get("/", async (c) => {
  const tags = await db.select().from(tagsTable)
  return c.json(tags)
})

app.get("/:id", async (c) => {
  const { id } = c.req.param()
  const tag = await db
    .select()
    .from(tagsTable)
    .where(eq(tagsTable.id, Number(id)))
  return c.json(tag)
})

export default app
