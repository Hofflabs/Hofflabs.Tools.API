export interface UserObject {
  user: User
  userAuth: UserAuth
  userProfile: UserProfile
  userLoginMetadata: UserLoginMetadata
  userExternalAuth: UserExternalAuth
  userCompliance: UserCompliance
  userReferrals: UserReferrals
  userLicensing: UserLicensing
  userAdminNotes: UserAdminNotes
}

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  password_hash?: string
  role: string
  sub_roles: string
  department?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface UserAuth {
  user_id: number
  is_banned: boolean
  is_shadowbanned: boolean
  ban_reason?: string
  mfa_enabled: boolean
  mfa_secret?: string
  mfa_method?: string
  password_reset_token?: string
  password_reset_expires?: string
  login_attempts: number
  locked_until?: string
  last_password_change?: string
  sessions: string
}

export interface UserProfile {
  user_id: number
  avatar_url?: string
  timezone?: string
  locale?: string
  language?: string
  email_verified: boolean
  notification_settings?: string
  tags?: string
  custom_attributes?: string
  onboarding_step?: string
}

export interface UserLoginMetadata {
  user_id: number
  first_login_at?: string
  last_login?: string
  last_login_ip?: string
  known_ips?: string
  last_login_user_agent?: string
  last_active_at?: string
}

export interface UserExternalAuth {
  user_id: number
  source_provider?: string
  external_id?: string
  auth_provider_user_info?: string
  directory_groups?: string
  last_synced_at?: string
}

export interface UserCompliance {
  user_id: number
  consent_required: boolean
  terms_accepted_at?: string
  privacy_accepted_at?: string
  data_export_requested_at?: string
  data_deleted_at?: string
  deactivation_reason?: string
  expires_at?: string
}

export interface UserReferrals {
  user_id: number
  invited_by?: string
  invited_at?: string
  referral_code?: string
  referred_by?: string
}

export interface UserLicensing {
  user_id: number
  license_type?: string
  license_key?: string
  license_expires_at?: string
}

export interface UserAdminNotes {
  user_id: number
  admin_notes?: string
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export function createDefaultUserObject(overrides: DeepPartial<UserObject> = {}): UserObject {
  const now = new Date().toISOString()
  return {
    user: {
      id: 0,
      username: 'newuser',
      email: 'user@example.com',
      full_name: 'New User',
      password_hash: '',
      role: 'user',
      sub_roles: '[]',
      department: '',
      is_active: true,
      created_at: now,
      updated_at: now,
      ...overrides.user
    },
    userAuth: {
      user_id: 0,
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
      sessions: '[]',
      ...overrides.userAuth
    },
    userProfile: {
      user_id: 0,
      avatar_url: '',
      timezone: 'UTC',
      locale: 'en-US',
      language: 'en',
      email_verified: false,
      notification_settings: '{}',
      tags: '[]',
      custom_attributes: '{}',
      onboarding_step: 'start',
      ...overrides.userProfile
    },
    userLoginMetadata: {
      user_id: 0,
      first_login_at: now,
      last_login: now,
      last_login_ip: '0.0.0.0',
      known_ips: '[]',
      last_login_user_agent: '',
      last_active_at: now,
      ...overrides.userLoginMetadata
    },
    userExternalAuth: {
      user_id: 0,
      source_provider: 'local',
      external_id: '',
      auth_provider_user_info: '{}',
      directory_groups: '[]',
      last_synced_at: '',
      ...overrides.userExternalAuth
    },
    userCompliance: {
      user_id: 0,
      consent_required: true,
      terms_accepted_at: '',
      privacy_accepted_at: '',
      data_export_requested_at: '',
      data_deleted_at: '',
      deactivation_reason: '',
      expires_at: '',
      ...overrides.userCompliance
    },
    userReferrals: {
      user_id: 0,
      invited_by: '',
      invited_at: now,
      referral_code: '',
      referred_by: '',
      ...overrides.userReferrals
    },
    userLicensing: {
      user_id: 0,
      license_type: 'free',
      license_key: '',
      license_expires_at: '',
      ...overrides.userLicensing
    },
    userAdminNotes: {
      user_id: 0,
      admin_notes: '',
      ...overrides.userAdminNotes
    }
  }
}
