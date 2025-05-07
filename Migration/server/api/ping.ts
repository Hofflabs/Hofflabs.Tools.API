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
        return { error: 'Missing or invalid database type.' }
      }
  
      const internalDbs = ['sqlite']
      const isInternal = internalDbs.includes(dbType.toLowerCase())
  
      console.log({
        appInfo,
        connection: {
          internal: isInternal.toString(),
        },
      });
      return {
        appInfo,
        connection: {
          internal: isInternal.toString(),
        },
      }
    }
  
    setResponseStatus(event, 405)
    return { error: 'Method not allowed' }
  })
  