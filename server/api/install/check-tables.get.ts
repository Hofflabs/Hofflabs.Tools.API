import db from '../../database/sqlite/sqlite'

export default defineEventHandler(() => {
  const tables = [
    'users',
    'user_auth',
    'user_profile',
    'user_login_metadata',
    'user_external_auth',
    'user_compliance',
    'user_referrals',
    'user_licensing',
    'user_admin_notes'
  ]

  const missing: string[] = []

  for (const table of tables) {
    const exists = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
      .get(table)

    if (!exists) missing.push(table)
  }

  return {
    allReady: missing.length === 0,
    missing
  }
})
