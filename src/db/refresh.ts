import 'dotenv/config'
import { db } from './db'
import { usersTable, categoriesTable, tagsTable, postsTable, postsTagsTable } from './schema'

async function refresh() {
  // Delete all data from the database
  await db.delete(postsTagsTable)
  await db.delete(postsTable)
  await db.delete(tagsTable)
  await db.delete(categoriesTable)
  await db.delete(usersTable)

  console.log('Database refreshed.')
  process.exit(0)
}

refresh()