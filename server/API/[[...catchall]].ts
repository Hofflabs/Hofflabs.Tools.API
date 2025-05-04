// /server/api/[[...catchall]].ts
export default defineEventHandler(async (event) => {
    const method = event.node.req.method || 'GET'
    const raw = event.context.params?.catchall
    const path = Array.isArray(raw) ? raw.join('/') : (raw || '')
    
  
    // 🔒 Block internal-only routes
    if (path.startsWith('internal/')) {
      setResponseStatus(event, 403)
      return { error: 'Forbidden: Internal route' }
    }
  
    // 🌐 Custom routing logic
    if (path === 'example/path' && method === 'GET') {
      return { message: 'This is a handled GET request' }
    }
  
    if (path === 'example/path' && method === 'POST') {
      const body = await readBody(event)
      return { message: 'Received POST', data: body }
    }
  
    // 🧱 Default fallback for unhandled routes
    setResponseStatus(event, 404)
    return { error: 'API route not found', path, method }
  })
  