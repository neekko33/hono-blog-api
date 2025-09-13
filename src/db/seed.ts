import 'dotenv/config'
import { create } from './factory'

async function seed() {
  await create('user')
  await create('category', 5)
  await create('tag', 5)
  await create('post', 20)
  console.log('Seeding completed.')
  process.exit(0)
}

seed()
