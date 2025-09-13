import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { db } from './db.js'
import {
  usersTable,
  categoriesTable,
  postsTable,
  tagsTable,
  postsTagsTable,
} from './schema.js'

const uniqueNames = new Set()

const createUniqueName = () => {
  let name = ''
  let attempts = 0
  const maxAttempts = 100
  do {
    name = faker.word.adjective()
    attempts++
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate a unique name')
    }
  } while (uniqueNames.has(name))
  uniqueNames.add(name)
  return name
}

const createUser = async (overrides = {}) => {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await bcrypt.hash('password', 2), // default password
    ...overrides,
  }

  const [insertedUser] = await db.insert(usersTable).values(user).returning()
  return insertedUser
}

const createCategory = async (overrides = {}) => {
  const category = {
    name: createUniqueName(),
    ...overrides,
  }

  await db.insert(categoriesTable).values(category).returning()
}

const createTag = async (overrides = {}) => {
  const tag = {
    name: createUniqueName(),
    ...overrides,
  }

  const [insertedTag] = await db.insert(tagsTable).values(tag).returning()
  return insertedTag
}

const createPost = async (overrides = {}) => {
  const user = await db
    .select()
    .from(usersTable)
    .limit(1)
    .orderBy('id', 'desc')
    .then(r => r[0])
  const categories = await db.select().from(categoriesTable)
  const tags = await db.select().from(tagsTable)

  const post = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author_id: user.id,
    category_id: categories.length
      ? faker.helpers.arrayElement(categories).id
      : undefined,
    ...overrides,
  }

  const [insertedPost] = await db.insert(postsTable).values(post).returning()

  const selectedTags = faker.helpers.arrayElements(
    tags,
    faker.number.int({ min: 1, max: Math.min(5, tags.length) })
  )
  const postTags = selectedTags.map(tag => ({
    post_id: insertedPost.id,
    tag_id: tag.id,
  }))

  await db.insert(postsTagsTable).values(postTags).returning()

  return insertedPost
}

export const create = async (type: string, times = 1, overrides = {}) => {
  for (let i = 0; i < times; i++) {
    switch (type) {
      case 'user':
        await createUser(overrides)
        break
      case 'category':
        await createCategory(overrides)
        break
      case 'tag':
        await createTag(overrides)
        break
      case 'post':
        await createPost(overrides)
        break
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }
}
