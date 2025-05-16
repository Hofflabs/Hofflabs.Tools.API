import { createUserTablesSqlite } from '../../database/sqlite/schema/initUserTables'

export default defineEventHandler(() => {
  createUserTablesSqlite()
  return { success: true }
})