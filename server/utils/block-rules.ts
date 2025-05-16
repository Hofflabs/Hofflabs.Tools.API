import Database from 'better-sqlite3'

export interface BlockRule {
    id?: number
    type: 'ip' | 'ip_range' | 'country' | 'route' | 'user_agent' | 'application_id' | 'region_redirect' | 'internal_ip'
    value: string
    reason?: string
    redirectUrl?: string
    whitelist?: boolean
    blacklist?: boolean
}

const db = new Database('./data/api_metrics.db')

// Create block_rules table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS block_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    reason TEXT,
    redirect_url TEXT,
    whitelist BOOLEAN DEFAULT 0,
    blacklist BOOLEAN DEFAULT 0
  )
`)

// Insert
export function insertRule(rule: BlockRule) {
    const stmt = db.prepare(`
    INSERT INTO block_rules (type, value, reason, redirect_url, whitelist, blacklist)
    VALUES (@type, @value, @reason, @redirectUrl, @whitelist, @blacklist)
  `)
    stmt.run(rule)
}

// Get rules by type
export function getRulesByType(type: BlockRule['type']): BlockRule[] {
    const stmt = db.prepare('SELECT * FROM block_rules WHERE type = ?')
    return stmt.all(type) as BlockRule[]
}

// Match a specific value
export function isBlacklisted(type: BlockRule['type'], value: string): boolean {
    const stmt = db.prepare(`
    SELECT 1 FROM block_rules WHERE type = ? AND value = ? AND blacklist = 1
  `)
    return !!stmt.get(type, value)
}

export function isWhitelisted(type: BlockRule['type'], value: string): boolean {
    const stmt = db.prepare(`
    SELECT 1 FROM block_rules WHERE type = ? AND value = ? AND whitelist = 1
  `)
    return !!stmt.get(type, value)
}

export function updateBlockRule(id: number, updates: Partial<BlockRule>) {
    const keys = Object.keys(updates)
    if (keys.length === 0) return

    const assignments = keys.map(k => `${snakeCase(k)} = @${k}`).join(', ')
    const stmt = db.prepare(`UPDATE block_rules SET ${assignments} WHERE id = @id`)
    stmt.run({ id, ...updates })
}

function snakeCase(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

