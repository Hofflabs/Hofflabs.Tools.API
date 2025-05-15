export interface User {
    id: number
    username: string
    email: string
    full_name: string
    password_hash?: string
    role: string
    department?: string
    is_active: boolean
    created_at: string
    updated_at?: string
  }
  
  export interface UserAuth {
    user_id: number
    is_email_login_allowed: boolean
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
    session_revoked_at?: string
  }
  
  export interface UserProfile {
    user_id: number
    avatar_url?: string
    timezone?: string
    locale?: string
    email_verified: boolean
    terms_accepted_at?: string
    privacy_accepted_at?: string
    notification_settings?: string // JSON blob
    tags?: string // comma or JSON
    custom_attributes?: string // JSON
    onboarding_step?: string
  }
  
  export interface UserLoginMetadata {
    user_id: number
    first_login_at?: string
    last_login?: string
    last_login_ip?: string
    known_ips?: string // JSON or CSV
    last_login_user_agent?: string
    last_active_at?: string
  }
  
  export interface UserExternalAuth {
    user_id: number
    source_provider?: string
    external_id?: string
    auth_provider_user_info?: string // raw JSON string from OAuth/LDAP
    directory_groups?: string // JSON or CSV
    last_synced_at?: string
  }
  
  export interface UserCompliance {
    user_id: number
    consent_required: boolean
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
  