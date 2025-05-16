import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'

export function createSessionJWT(sessionData: object): string {
  return jwt.sign(sessionData, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '30d',
  })
}

export function verifySessionJWT(token: string): any {
  return jwt.verify(token, JWT_SECRET)
}