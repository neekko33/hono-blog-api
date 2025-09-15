import { Hono } from 'hono'
import { db } from '../db/db.js'
import { categoriesTable, postsTagsTable, usersTable } from '../db/schema.js'
import { desc, eq } from 'drizzle-orm'
import { tagsTable } from '../db/schema.js'
import { postsTable } from '../db/schema.js'

const app = new Hono()

app.get('/home', async c => {
  const me = await db.select().from(usersTable).limit(1)
  if (!me || me.length === 0) {
    return c.json({ message: 'No user found' }, 404)
  }

  const postsCount = await db.$count(postsTable)

  const categories = await db.select().from(categoriesTable)
  const tags = await db.select().from(tagsTable)

  const categoryResult = await Promise.all(
    categories.map(async category => {
      return {
        ...category,
        postsCount: await db.$count(
          postsTable,
          eq(postsTable.category_id, category.id)
        ),
      }
    })
  )

  const result = {
    profile: {
      name: me[0].name,
      avatarUrl: me[0].avatar_url,
      bio: me[0].bio,
      postsCount,
      categoriesCount: categories.length,
      tagsCount: tags.length,
    },
    categories: categoryResult,
    tags,
  }

  return c.json(result)
})

app.get('/archives', async c => {
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.created_at))

  const postsWithTags = await Promise.all(
    posts.map(async post => {
      const tags = await db
        .select()
        .from(postsTagsTable)
        .where(eq(postsTagsTable.post_id, post.id))
        .leftJoin(tagsTable, eq(tagsTable.id, postsTagsTable.tag_id))
      return {
        ...post,
        tags: tags.map(t => t.tags),
      }
    })
  )

  const grouped = postsWithTags.reduce((acc, post) => {
    const year = new Date(post.created_at).getFullYear()
    if (!acc[year]) {
      acc[year] = [post] // 初始化为数组
    } else {
      acc[year].push(post) // 添加到数组
    }
    return acc // 返回累积值
  }, {} as Record<number, (typeof posts)[0][]>)

  return c.json(grouped)
})

app.get('/posts', async c => {
  const { page = '1', pageSize = '10' } = c.req.query()
  const pageNum = parseInt(page)
  const sizeNum = parseInt(pageSize)

  if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
    return c.json({ message: 'Invalid page or pageSize' }, 400)
  }

  const posts = await db
    .select()
    .from(postsTable)
    .limit(sizeNum)
    .offset((pageNum - 1) * sizeNum)
    .orderBy(desc(postsTable.created_at))

  const postsWithTags = await Promise.all(
    posts.map(async post => {
      const tags = await db
        .select()
        .from(postsTagsTable)
        .where(eq(postsTagsTable.post_id, post.id))
        .leftJoin(tagsTable, eq(tagsTable.id, postsTagsTable.tag_id))
      return {
        ...post,
        tags: tags.map(t => t.tags),
      }
    })
  )

  return c.json(postsWithTags)
})

app.get('/posts/:id', async c => {
  const { id } = c.req.param()
  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(id)))
  return c.json(post)
})

export default app
