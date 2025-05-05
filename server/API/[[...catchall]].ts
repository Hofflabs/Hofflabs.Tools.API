export default defineEventHandler(async (event) => {
  const method = event.node.req.method || 'GET'
  const fullUrl = event.node.req.url || '/'
  const url = new URL(fullUrl, 'http://localhost') // base is required
  const pathname = url.pathname

  const raw = event.context.params?.catchall
  const path = Array.isArray(raw) ? raw.join('/') : (raw || '')
  
  console.log({ path, pathname, fullUrl, raw })
  
  // Block internal routes
  if (pathname.startsWith('/api/internal')) {
    setResponseStatus(event, 403)
    return { error: 'Forbidden: Internal route' }
  }

  if (path === 'example/path' && method === 'GET') {
    return { message: 'This is a handled GET request' }
  }

  if (path === 'example/path' && method === 'POST') {
    const body = await readBody(event)
    return { message: 'Received POST', data: body }
  }


  setResponseStatus(event, 404)
  return { error: 'API route not found', path, method }
})
