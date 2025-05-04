import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
    sendRedirect(event, '/api/index.html')
  })