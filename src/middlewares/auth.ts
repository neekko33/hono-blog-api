import { createMiddleware } from 'hono/factory'
import { verifyToken, TokenType } from '../helpers.js'

export const auth = createMiddleware(async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = await verifyToken(token, TokenType.ACCESS)
    if (!payload) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    c.set('user', payload)
    await next()
  } catch (error) {
    return c.json({ message: 'Invalid or expired token' }, 401)
  }
})
