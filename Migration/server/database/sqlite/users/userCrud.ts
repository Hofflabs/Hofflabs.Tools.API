// server/database/sqlite/userCrud.ts
import db from '../sqlite'
import {
  User, UserAuth, UserProfile, UserLoginMetadata, UserExternalAuth,
  UserCompliance, UserReferrals, UserLicensing, UserAdminNotes
} from '~./types/user'

function insert<T extends Record<string, any>>(table: string, data: T) {
    const keys = Object.keys(data).join(', ')
    const placeholders = Object.keys(data).map(k => `@${k}`).join(', ')
    const stmt = db.prepare(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`)
    return stmt.run(data)
  }
  
  function update<T extends Record<string, any>>(table: string, idKey: string, data: T) {
    const entries = Object.keys(data).filter(k => k !== idKey)
    const sets = entries.map(k => `${k} = @${k}`).join(', ')
    const stmt = db.prepare(`UPDATE ${table} SET ${sets} WHERE ${idKey} = @${idKey}`)
    return stmt.run(data)
  }
  
  function findById<T>(table: string, idKey: string, id: number): T | undefined {
    const row = db.prepare(`SELECT * FROM ${table} WHERE ${idKey} = ?`).get(id)
    return row as T
  }
  
  function findAll<T>(table: string): T[] {
    const rows = db.prepare(`SELECT * FROM ${table}`).all()
    return rows as T[]
  }
  
  function remove(table: string, idKey: string, id: number) {
    return db.prepare(`DELETE FROM ${table} WHERE ${idKey} = ?`).run(id)
  }  

// Export CRUD methods per table
export const Users = {
  create: (data: User) => insert('users', data),
  update: (data: User) => update('users', 'id', data),
  delete: (id: number) => remove('users', 'id', id),
  get: (id: number) => findById<User>('users', 'id', id),
  all: () => findAll<User>('users')
}

export const UserAuths = {
  create: (data: UserAuth) => insert('user_auth', data),
  update: (data: UserAuth) => update('user_auth', 'user_id', data),
  delete: (id: number) => remove('user_auth', 'user_id', id),
  get: (id: number) => findById<UserAuth>('user_auth', 'user_id', id),
  all: () => findAll<UserAuth>('user_auth')
}

export const UserProfiles = {
  create: (data: UserProfile) => insert('user_profile', data),
  update: (data: UserProfile) => update('user_profile', 'user_id', data),
  delete: (id: number) => remove('user_profile', 'user_id', id),
  get: (id: number) => findById<UserProfile>('user_profile', 'user_id', id),
  all: () => findAll<UserProfile>('user_profile')
}

export const UserLoginMetadataStore = {
  create: (data: UserLoginMetadata) => insert('user_login_metadata', data),
  update: (data: UserLoginMetadata) => update('user_login_metadata', 'user_id', data),
  delete: (id: number) => remove('user_login_metadata', 'user_id', id),
  get: (id: number) => findById<UserLoginMetadata>('user_login_metadata', 'user_id', id),
  all: () => findAll<UserLoginMetadata>('user_login_metadata')
}

export const UserExternalAuths = {
  create: (data: UserExternalAuth) => insert('user_external_auth', data),
  update: (data: UserExternalAuth) => update('user_external_auth', 'user_id', data),
  delete: (id: number) => remove('user_external_auth', 'user_id', id),
  get: (id: number) => findById<UserExternalAuth>('user_external_auth', 'user_id', id),
  all: () => findAll<UserExternalAuth>('user_external_auth')
}

export const UserCompliances = {
  create: (data: UserCompliance) => insert('user_compliance', data),
  update: (data: UserCompliance) => update('user_compliance', 'user_id', data),
  delete: (id: number) => remove('user_compliance', 'user_id', id),
  get: (id: number) => findById<UserCompliance>('user_compliance', 'user_id', id),
  all: () => findAll<UserCompliance>('user_compliance')
}

export const UserReferralsStore = {
  create: (data: UserReferrals) => insert('user_referrals', data),
  update: (data: UserReferrals) => update('user_referrals', 'user_id', data),
  delete: (id: number) => remove('user_referrals', 'user_id', id),
  get: (id: number) => findById<UserReferrals>('user_referrals', 'user_id', id),
  all: () => findAll<UserReferrals>('user_referrals')
}

export const UserLicensings = {
  create: (data: UserLicensing) => insert('user_licensing', data),
  update: (data: UserLicensing) => update('user_licensing', 'user_id', data),
  delete: (id: number) => remove('user_licensing', 'user_id', id),
  get: (id: number) => findById<UserLicensing>('user_licensing', 'user_id', id),
  all: () => findAll<UserLicensing>('user_licensing')
}

export const UserAdminNotesStore = {
  create: (data: UserAdminNotes) => insert('user_admin_notes', data),
  update: (data: UserAdminNotes) => update('user_admin_notes', 'user_id', data),
  delete: (id: number) => remove('user_admin_notes', 'user_id', id),
  get: (id: number) => findById<UserAdminNotes>('user_admin_notes', 'user_id', id),
  all: () => findAll<UserAdminNotes>('user_admin_notes')
}
