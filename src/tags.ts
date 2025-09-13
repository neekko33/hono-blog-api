import { Hono } from "hono"
import { tagsTable } from "./db/schema.js"
import { db } from "./db/db.js"
import { eq } from "drizzle-orm"

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

app.post("/", async (c) => {
  const newTag = await c.req.json()
  const inserted = await db.insert(tagsTable).values(newTag).returning()
  return c.json(inserted)
})

app.put("/:id", async (c) => {
  const { id } = c.req.param()
  const updatedTag = await c.req.json()
  const updated = await db
    .update(tagsTable)
    .set(updatedTag)
    .where(eq(tagsTable.id, Number(id)))
    .returning()
  return c.json(updated)
})

app.delete("/:id", async (c) => {
  const { id } = c.req.param()
  const deleted = await db
    .delete(tagsTable)
    .where(eq(tagsTable.id, Number(id)))
    .returning()
  return c.json(deleted)
})

export default app
