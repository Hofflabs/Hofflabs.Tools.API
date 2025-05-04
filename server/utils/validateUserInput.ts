import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

const dangerousPatterns: RegExp[] = [
  /<script.*?>.*?<\/script>/gi,          // XSS
  /on\w+=".*?"/gi,                        // Inline JS handlers
  /javascript:/gi,                       // JS in href/src
  /data:text\/html/gi,                   // Data URI XSS
  /['"`][\s]*\b(or|and)\b[\s]*['"`]/gi,   // SQL boolean injection
  /\b(UNION|SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|CREATE|REPLACE)\b/gi,
  /--|;|\/\*|\*\/|@@|@/g,                 // SQL comment/meta
  /\0/g                                   // Null byte
]

export function validateUserInput(input: string): { safe: boolean, sanitized: string } {
  if (typeof input !== 'string') return { safe: false, sanitized: '' }

  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()

  const isSafe = !dangerousPatterns.some((pattern) => pattern.test(sanitized))

  return {
    safe: isSafe,
    sanitized
  }
}
