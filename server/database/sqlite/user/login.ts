import db from '../sqlite'
import crypto from 'crypto'
import type { User } from '~./types/user'
import { createError } from 'h3'

function getEncKey(): Buffer {
  const key = useRuntimeConfig().key
  if (!key) throw new Error('ENCRYPTION_KEY is missing from runtime config')
  return Buffer.from(key, 'base64')
}
const IV_LENGTH = 12 // AES-GCM IV

function decrypt(encryptedBase64: string): string {
  const ENC_KEY = getEncKey()
  const buffer = Buffer.from(encryptedBase64, 'base64')
  const iv = buffer.subarray(0, 12)
  const tag = buffer.subarray(12, 28)
  const encryptedText = buffer.subarray(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', ENC_KEY, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}


export function loginUser(email: string, password: string): { id: number; username: string; email: string } {
  
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

  const user = db
    .prepare('SELECT id, email, username, password_hash, is_active FROM users WHERE email = ? LIMIT 1')
    .get(email) as User | undefined

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  if (!user.is_active) {
    throw createError({ statusCode: 403, statusMessage: 'Account is deactivated.' })
  }

  if (!user.password_hash) {
    throw createError({ statusCode: 401, statusMessage: 'Password not set.' })
  }

  const decrypted = decrypt(user.password_hash)

  if (decrypted !== password) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email
  }
}
