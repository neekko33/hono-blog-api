import { sign, verify } from "hono/jwt"
import bcrypt from 'bcrypt'
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export const generateToken = async (userId: string, type: TokenType) => {
  const secret = process.env.JWT_SECRET!
  const now = Math.floor(Date.now() / 1000)
  const exp = now + (type === TokenType.ACCESS ? 60 * 60 : 60 * 60 * 24 * 30) // 1 hour for access, 30 days for refresh

  const payload = {
    sub: userId,
    type,
    iat: now,
    exp,
  }

  return await sign(payload, secret)
}

export const verifyToken = async (token: string, expectedType: TokenType) => {
  const secret = process.env.JWT_SECRET!
  try {
    const payload = await verify(token, secret)
    if (payload.type !== expectedType) {
      throw new Error('Invalid token type')
    }
    return payload as { sub: string; type: TokenType; iat: number; exp: number }
  } catch (error) {
    return null
  }
}
