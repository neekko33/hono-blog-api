import { Hono } from 'hono'
import { db } from '../db/db.js'
import { categoriesTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { tagsTable } from '../db/schema.js'
import { postsTable } from '../db/schema.js'

const app = new Hono()

app.get("/categories", async (c) => {
  const categories = await db.select().from(categoriesTable)
  return c.json(categories)
})

app.get("/categories/:id", async (c) => {
  const { id } = c.req.param()
  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, Number(id)))
  return c.json(category)
})

app.get("/tags", async (c) => {
  const tags = await db.select().from(tagsTable)
  return c.json(tags)
})

app.get("/tags/:id", async (c) => {
  const { id } = c.req.param()
  const tag = await db
    .select()
    .from(tagsTable)
    .where(eq(tagsTable.id, Number(id)))
  return c.json(tag)
})

app.get("/posts", async (c) => {
  const posts = await db.select().from(postsTable)
  return c.json(posts)
})

app.get("/posts/:id", async (c) => {
  const { id } = c.req.param()
  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(id)))
  return c.json(post)
})

export default app