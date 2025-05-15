import { readBody, defineEventHandler, getMethod, setResponseStatus } from 'h3'
import { useRuntimeConfig } from '#imports'
import { existsSync } from 'fs'
import Database from 'better-sqlite3'
// import mysql from 'mysql2/promise'
// import { Client as PgClient } from 'pg'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const method = getMethod(event)

  const appInfo = {
    appName: config.appName,
    appVersion: config.appVersion,
  }

  if (method === 'GET') {
    return { appInfo }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const dbType = body?.db

    if (!dbType || typeof dbType !== 'string') {
      setResponseStatus(event, 400)
      return { error: 'Invalid or missing parameters.' }
    }

    let internal = false
    try {
      switch (dbType.toLowerCase()) {
        case 'sqlite': {
            const path = '.data/content/contents.sqlite'
            if (!existsSync(path)) {
              throw new Error(`SQLite file not found at ${path}`)
            }
            const db = new Database(path, { readonly: true })
            db.prepare('SELECT 1').get()
            db.close()
            internal = true
            break
          }
        // case 'mysql': {
        //   const { host, user, password, database, port } = body
        //   const conn = await mysql.createConnection({
        //     host,
        //     user,
        //     password,
        //     database,
        //     port: Number(port || 3306),
        //   })
        //   await conn.query('SELECT 1')
        //   await conn.end()
        //   break
        // }
        // case 'postgres': {
        //   const { host, user, password, database, port } = body
        //   const client = new PgClient({
        //     host,
        //     user,
        //     password,
        //     database,
        //     port: Number(port || 5432),
        //   })
        //   await client.connect()
        //   await client.query('SELECT 1')
        //   await client.end()
        //   break
        // }
        default:
          throw new Error('Unsupported database type')
      }
    } catch (e) {
      console.error(`Connection failed for ${dbType}:`, e)
      setResponseStatus(event, 400)
      return {
        appInfo,
        connection: {
          internal: dbType === 'sqlite' ? 'false' : 'false',
          error: 'Unable to connect to database',
        },
      }
    }

    return {
      appInfo,
      connection: {
        internal: internal.toString(),
      },
    }
  }

  setResponseStatus(event, 405)
  return { error: 'Method not allowed' }
})
