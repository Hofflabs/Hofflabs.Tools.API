// server/database/sqlite/initUserTables.ts
import db from '../sqlite'

export function createUserTablesSqlite() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL,
      department TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_auth (
      user_id INTEGER PRIMARY KEY,
      is_email_login_allowed BOOLEAN DEFAULT 1,
      is_banned BOOLEAN DEFAULT 0,
      is_shadowbanned BOOLEAN DEFAULT 0,
      ban_reason TEXT,
      mfa_enabled BOOLEAN DEFAULT 0,
      mfa_secret TEXT,
      mfa_method TEXT,
      password_reset_token TEXT,
      password_reset_expires TIMESTAMP,
      login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP,
      last_password_change TIMESTAMP,
      session_revoked_at TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      user_id INTEGER PRIMARY KEY,
      avatar_url TEXT,
      timezone TEXT,
      locale TEXT,
      email_verified BOOLEAN DEFAULT 0,
      terms_accepted_at TIMESTAMP,
      privacy_accepted_at TIMESTAMP,
      notification_settings TEXT,
      tags TEXT,
      custom_attributes TEXT,
      onboarding_step TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_login_metadata (
      user_id INTEGER PRIMARY KEY,
      first_login_at TIMESTAMP,
      last_login TIMESTAMP,
      last_login_ip TEXT,
      known_ips TEXT,
      last_login_user_agent TEXT,
      last_active_at TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_external_auth (
      user_id INTEGER PRIMARY KEY,
      source_provider TEXT,
      external_id TEXT,
      auth_provider_user_info TEXT,
      directory_groups TEXT,
      last_synced_at TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_compliance (
      user_id INTEGER PRIMARY KEY,
      consent_required BOOLEAN DEFAULT 0,
      data_export_requested_at TIMESTAMP,
      data_deleted_at TIMESTAMP,
      deactivation_reason TEXT,
      expires_at TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_referrals (
      user_id INTEGER PRIMARY KEY,
      invited_by TEXT,
      invited_at TIMESTAMP,
      referral_code TEXT UNIQUE,
      referred_by TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_licensing (
      user_id INTEGER PRIMARY KEY,
      license_type TEXT,
      license_key TEXT,
      license_expires_at TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_admin_notes (
      user_id INTEGER PRIMARY KEY,
      admin_notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)
}
