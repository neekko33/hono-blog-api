import { Hono } from "hono"
import { postsTable } from "./db/schema.js"
import { db } from "./db/db.js"
import { eq } from "drizzle-orm"

const app = new Hono()

app.get("/", async (c) => {
  const posts = await db.select().from(postsTable)
  return c.json(posts)
})

app.get("/:id", async (c) => {
  const { id } = c.req.param()
  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(id)))
  return c.json(post)
})

app.post("/", async (c) => {
  const newPost = await c.req.json()
  const inserted = await db.insert(postsTable).values(newPost).returning()
  return c.json(inserted)
})

app.put("/:id", async (c) => {
  const { id } = c.req.param()
  const updatedPost = await c.req.json()
  const updated = await db
    .update(postsTable)
    .set(updatedPost)
    .where(eq(postsTable.id, Number(id)))
    .returning()
  return c.json(updated)
})

app.delete("/:id", async (c) => {
  const { id } = c.req.param()
  const deleted = await db
    .delete(postsTable)
    .where(eq(postsTable.id, Number(id)))
    .returning()
  return c.json(deleted)
})

export default app