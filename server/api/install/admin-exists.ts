import db from '../../database/sqlite/sqlite'

export default defineEventHandler(() => {
  const row = db.prepare(`SELECT 1 FROM users WHERE role = 'admin' LIMIT 1`).get()
  return { adminExists: !!row }
})
