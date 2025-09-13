import { Hono } from 'hono'
import { db } from './db/db.js'
import users from './users.js'

const app = new Hono()

app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const user = await db
    .select()
    .from(usersTable)
    .where(usersTable.email.eq(email))
    .where(usersTable.password.eq(password))
    .limit(1)

  if (user.length === 0) {
    return c.json({ message: 'Invalid email or password' }, 401)
  }

  return c.json({ message: 'Login successful', user: user[0] })
})

app.post('/logout', (c) => {
  // In a real application, you would handle token invalidation or session destruction here
  return c.json({ message: 'Logout successful' })
})

app.post('/register', async (c) => {
  const newUser = await c.req.json()
  const inserted = await db.insert(usersTable).values(newUser).returning()
  return c.json(inserted)
})