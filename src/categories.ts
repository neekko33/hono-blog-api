import { Hono } from "hono"
import { categoriesTable } from "./db/schema.js"
import { db } from "./db/db.js"

const app = new Hono()

app.get("/", async (c) => {
  const categories = await db.select().from(categoriesTable)
  return c.json(categories)
})

app.get("/:id", async (c) => {
  const { id } = c.req.param()
  const category = await db
    .select()
    .from(categoriesTable)
    .where(categoriesTable.id.eq(Number(id)))
  return c.json(category)
})

app.post("/", async (c) => {
  const newCategory = await c.req.json()
  const inserted = await db.insert(categoriesTable).values(newCategory).returning()
  return c.json(inserted)
})

app.put("/:id", async (c) => {
  const { id } = c.req.param()
  const updatedCategory = await c.req.json()
  const updated = await db
    .update(categoriesTable)
    .set(updatedCategory)
    .where(categoriesTable.id.eq(Number(id)))
    .returning()
  return c.json(updated)
})

app.delete("/:id", async (c) => {
  const { id } = c.req.param()
  const deleted = await db
    .delete(categoriesTable)
    .where(categoriesTable.id.eq(Number(id)))
    .returning()
  return c.json(deleted)
})

export default app