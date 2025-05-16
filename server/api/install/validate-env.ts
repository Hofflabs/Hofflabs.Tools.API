import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  const required = {
    ENCRYPTION_KEY: config.key,
    APP_NAME: config.public.appName,
    APP_URL: config.public.appUrl,
    API_URL: config.public.apiUrl,
    HOST: config.public.host,
    PORT: config.public.port,
    DATABASE: config.database,
  }

  const missing = Object.entries(required).filter(([, v]) => !v)

  const db = config.database.toLowerCase()

  const dbFields = {
    sqlite: ['sqliteConnectionUrl'],
    postgres: ['postgres.host', 'postgres.user', 'postgres.password', 'postgres.database'],
    mysql: ['mysql.host', 'mysql.user', 'mysql.password', 'mysql.database'],
    rds: ['rds.endpoint', 'rds.user', 'rds.password', 'rds.database'],
    gcloud: ['gcloud.instanceConnectionName', 'gcloud.user', 'gcloud.password', 'gcloud.database']
  }[db] || []

  const dbMissing = dbFields.filter((field) => {
    const keys = field.split('.')
    return !keys.reduce((o, k) => (o ? o[k] : undefined), config)
  })

  if (missing.length || dbMissing.length) {
    return {
      valid: false,
      missing: [...missing.map(([k]) => k), ...dbMissing]
    }
  }

  return { valid: true }
})
