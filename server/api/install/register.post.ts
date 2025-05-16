import db from '../../database/sqlite/sqlite'
import crypto from 'crypto'
import { createError, readBody } from 'h3'
import type { UserObject } from '~./types/user'
import { validateUserInput } from '../../utils/validateUserInput'
import validator from 'validator'

const allowedLanguages = ['en', 'es', 'fr', 'de', 'ja']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate email
  if (!validator.isEmail(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address.' })
  }

  // Validate password
  if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be 8–128 characters.' })
  }

  // Validate and sanitize username
  const safeUsername = validateUserInput(body.username)
  if (!safeUsername.safe) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or unsafe username.' })
  }

  const language = allowedLanguages.includes(body.language) ? body.language : 'en'

  const user = await registerAdmin({
    username: safeUsername.sanitized,
    email: body.email,
    password: body.password,
    language,
    termsAccepted: !!body.terms,
    privacyAccepted: !!body.privacy,
  })

  return {
    success: true,
    user,
  }
})

function getEncKey(): Buffer {
  const key = useRuntimeConfig().key
  if (!key) throw new Error('ENCRYPTION_KEY is missing from runtime config')
  return Buffer.from(key, 'base64')
}

const IV_LENGTH = 12

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

async function registerAdmin(body: {
  username: string
  email: string
  password: string
  language: string
  termsAccepted: boolean
  privacyAccepted: boolean
}): Promise<UserObject> {
  const { username, email, password, language, termsAccepted, privacyAccepted } = body

  if (!termsAccepted || !privacyAccepted) {
    throw createError({ statusCode: 400, statusMessage: 'You must accept the terms and privacy policy.' })
  }

  const exists = db.prepare('SELECT 1 FROM users WHERE username = ? OR email = ?').get(username, email)
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: 'Username or email already exists.' })
  }

  const now = new Date().toISOString()
  const encryptedPassword = encrypt(password)

  const result = db.prepare(`
    INSERT INTO users (username, email, full_name, password_hash, role, sub_roles, department, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'admin', '[]', '', 1, ?, ?)
  `).run(username, email, username, encryptedPassword, now, now)

  const userId = result.lastInsertRowid as number

  db.prepare(`INSERT INTO user_auth (user_id, is_banned, is_shadowbanned, mfa_enabled, login_attempts, sessions)
              VALUES (?, 0, 0, 0, 0, '[]')`).run(userId)

  db.prepare(`INSERT INTO user_profile (user_id, email_verified, language, timezone, locale, onboarding_step)
              VALUES (?, 0, ?, 'UTC', 'en-US', 'start')`).run(userId, language)

  db.prepare(`INSERT INTO user_compliance (user_id, consent_required, terms_accepted_at, privacy_accepted_at)
              VALUES (?, 0, ?, ?)`).run(userId, now, now)

  return {
    user: {
      id: userId,
      username,
      email,
      full_name: username,
      password_hash: encryptedPassword,
      role: 'admin',
      sub_roles: '[]',
      department: '',
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    userAuth: {
      user_id: userId,
      is_banned: false,
      is_shadowbanned: false,
      ban_reason: '',
      mfa_enabled: false,
      mfa_secret: '',
      mfa_method: '',
      password_reset_token: '',
      password_reset_expires: '',
      login_attempts: 0,
      locked_until: now,
      last_password_change: now,
      sessions: '[]'
    },
    userProfile: {
      user_id: userId,
      avatar_url: '',
      timezone: 'UTC',
      locale: 'en-US',
      language,
      email_verified: false,
      notification_settings: '{}',
      tags: '[]',
      custom_attributes: '{}',
      onboarding_step: 'start'
    },
    userLoginMetadata: {
      user_id: userId,
      first_login_at: now,
      last_login: now,
      last_login_ip: '0.0.0.0',
      known_ips: '[]',
      last_login_user_agent: '',
      last_active_at: now
    },
    userExternalAuth: {
      user_id: userId,
      source_provider: 'local',
      external_id: '',
      auth_provider_user_info: '{}',
      directory_groups: '[]',
      last_synced_at: ''
    },
    userCompliance: {
      user_id: userId,
      consent_required: true,
      terms_accepted_at: now,
      privacy_accepted_at: now,
      data_export_requested_at: '',
      data_deleted_at: '',
      deactivation_reason: '',
      expires_at: ''
    },
    userReferrals: {
      user_id: userId,
      invited_by: '',
      invited_at: now,
      referral_code: '',
      referred_by: ''
    },
    userLicensing: {
      user_id: userId,
      license_type: 'free',
      license_key: '',
      license_expires_at: ''
    },
    userAdminNotes: {
      user_id: userId,
      admin_notes: ''
    }
  }
}
