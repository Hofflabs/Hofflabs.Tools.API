import Database from 'better-sqlite3'

export interface ApiMetric {
  uid: string;
  userAgent?: string;
  ip?: string;
  geoRegion?: string;
  blocked: boolean;
  applicationId?: string;
  serverId?: string;
  timestampUtc: string;
  requestMethod?: string;
  responseStatus?: number;
  latencyMs?: number;
  referrer?: string;
  routePath?: string;
  apiVersion?: string;
  authMethod?: string;
}

const db = new Database('./data/api_metrics.db')

// Ensure table exists
db.exec(`CREATE TABLE IF NOT EXISTS api_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL,
  user_agent TEXT,
  ip TEXT,
  geo_region TEXT,
  blocked BOOLEAN NOT NULL DEFAULT 0,
  application_id TEXT,
  server_id TEXT,
  timestamp_utc TEXT NOT NULL,
  request_method TEXT,
  response_status INTEGER,
  latency_ms INTEGER,
  referrer TEXT,
  route_path TEXT,
  api_version TEXT,
  auth_method TEXT
)`)

// INSERT
export function insertMetric(metric: ApiMetric) {
  const stmt = db.prepare(`
    INSERT INTO api_metrics (
      uid, user_agent, ip, geo_region, blocked, application_id, server_id,
      timestamp_utc, request_method, response_status, latency_ms,
      referrer, route_path, api_version, auth_method
    ) VALUES (
      @uid, @userAgent, @ip, @geoRegion, @blocked, @applicationId, @serverId,
      @timestampUtc, @requestMethod, @responseStatus, @latencyMs,
      @referrer, @routePath, @apiVersion, @authMethod
    )
  `)
  stmt.run(metric)
}

// READ (single by id)
export function getMetricById(id: number): ApiMetric | null {
  const stmt = db.prepare('SELECT * FROM api_metrics WHERE id = ?')
  return stmt.get(id) as ApiMetric | null
}

// READ (all, optional limit)
export function getAllMetrics(limit = 100): ApiMetric[] {
  const stmt = db.prepare('SELECT * FROM api_metrics ORDER BY id DESC LIMIT ?')
  return stmt.all(limit) as ApiMetric[]
}

// UPDATE (by id)
export function updateMetric(id: number, updates: Partial<ApiMetric>) {
  const keys = Object.keys(updates)
  if (keys.length === 0) return

  const assignments = keys.map(k => `${snakeCase(k)} = @${k}`).join(', ')
  const stmt = db.prepare(`UPDATE api_metrics SET ${assignments} WHERE id = @id`)
  stmt.run({ id, ...updates })
}

// DELETE (by id)
export function deleteMetric(id: number) {
  const stmt = db.prepare('DELETE FROM api_metrics WHERE id = ?')
  stmt.run(id)
}

// Helper: camelCase to snake_case
function snakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
