// server/utils/checkDbConnection.ts
import { useRuntimeConfig } from '#imports'
import { createConnection } from 'mysql2/promise'
import { Client as PgClient } from 'pg'
import { existsSync } from 'fs'
import { join } from 'path'
import Database from 'better-sqlite3'
import { createConnection as createRdsConnection } from 'mysql2/promise'
import { createConnection as createGcloudConnection } from 'mysql2/promise'

export default defineEventHandler(async () => {
  var final = false
  const database = await testDB()
  const keys = await testKeys()
  const account = await testAdminAccount()
  if(database == true && keys == true) {
    final = true
  }
  return { exists: !!final };
});


async function testDB(): Promise<boolean> {
  const config = useRuntimeConfig()
  const dbType = config.database

  try {
    switch (dbType) {
      case 'sqlite': {
        const dbPath = join(process.cwd(), '.data/content', 'data.sqlite')
        if (!existsSync(dbPath)) return false
        const db = new Database(dbPath)
        db.prepare('SELECT 1').get()
          return true
      }

      case 'postgres': {
        const client = new PgClient({
          host: config.postgres.host,
          port: parseInt(config.postgres.port),
          user: config.postgres.user,
          password: config.postgres.password,
          database: config.postgres.database,
        })
        await client.connect()
        await client.query('SELECT 1')
        await client.end()
        return true
      }

      case 'mysql': {
        const connection = await createConnection({
          host: config.mysql.host,
          port: parseInt(config.mysql.port),
          user: config.mysql.user,
          password: config.mysql.password,
          database: config.mysql.database,
        })
        await connection.query('SELECT 1')
        await connection.end()
        return true
      }

      case 'rds': {
        const connection = await createRdsConnection({
          host: config.rds.endpoint,
          user: config.rds.user,
          password: config.rds.password,
          database: config.rds.database,
        })
        await connection.query('SELECT 1')
        await connection.end()
        return true
      }

      case 'gcloud': {
        const connection = await createGcloudConnection({
          socketPath: `/cloudsql/${config.gcloud.instanceConnectionName}`,
          user: config.gcloud.user,
          password: config.gcloud.password,
          database: config.gcloud.database,
        })
        await connection.query('SELECT 1')
        await connection.end()
        return true
      }

      default:
        return false
    }
  } catch {
    return false
  }
}

async function testKeys(): Promise<boolean> {
  const config = useRuntimeConfig()

  if (!config.vaultEnabled) {
    const key = config.key
    if (typeof key !== 'string') return false
    const buf = Buffer.from(key, 'base64')
    return buf.length === 32
  } else {
    return !!config.vaultAddr && !!config.vaultPass
  }
}

async function testAdminAccount(): Promise<boolean> {

  return true
}
