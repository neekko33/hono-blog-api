import { Hono } from 'hono'
import { db } from '../db/db.js'
import { eq } from 'drizzle-orm' 
import { generateToken, verifyToken, TokenType } from '../helpers.js'
import bcrypt from 'bcrypt'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { auth as authMiddleware } from '../middlewares/auth.js'
import { usersTable } from '../db/schema.js'

const app = new Hono()
app.use('/logout/*', authMiddleware)
app.use('/me/*', authMiddleware)

app.post('/refresh', async (c) => {
  const refreshToken = getCookie(c, 'refresh_token')
  if (!refreshToken) {
    return c.json({ message: 'No refresh token provided' }, 401)
  }

  try {
    const payload = await verifyToken(refreshToken, TokenType.REFRESH)
    if (!payload) {
      return c.json({ message: 'Invalid refresh token' }, 401)
    }
    const accessToken = await generateToken(payload.sub, TokenType.ACCESS)
    return c.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 900 })
  } catch (e) {
    return c.json({ message: 'Invalid or expired refresh token' }, 401)
  }
})

app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
  if (!user || user.length === 0) {
    return c.json({ message: 'Invalid email or password' }, 401)
  }

  const match = await bcrypt.compare(password, user[0].password)
  if (!match) {
    return c.json({ message: 'Invalid email or password' }, 401)
  }

  const accessToken = await generateToken(user[0].id, TokenType.ACCESS)
  const refreshToken = await generateToken(user[0].id, TokenType.REFRESH)
  
  setCookie(c, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/auth/refresh',
    maxAge: 30 * 24 * 60 * 60, // 1 month
  })

  return c.json({ 
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 900, // 15 minutes
   })
})

app.post('/logout', (c) => {
  deleteCookie(c, 'refresh_token', { path: '/auth/refresh' })
  return c.json({ message: 'Logout successful' })
})

app.get('/me', async (c) => {
  const userId = c.get('user').sub
  const user = await db.select().from(usersTable).where(eq(usersTable.id, Number(userId))).limit(1)
  if (!user || user.length === 0) {
    return c.json({ message: 'User not found' }, 404)
  }
  const { password, ...userData } = user[0]
  return c.json(userData)
})

export default app