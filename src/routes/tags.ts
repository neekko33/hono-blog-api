import { Hono } from 'hono'
import { tagsTable } from '../db/schema.js'
import { db } from '../db/db.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

export default app
