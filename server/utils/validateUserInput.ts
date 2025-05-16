import sanitizeHtml from 'sanitize-html'
import validator from 'validator'

const dangerousPatterns = [
  /on\w+=".*?"/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /['"`][\s]*\b(or|and)\b[\s]*['"`]/gi,
  /\b(UNION|SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|CREATE|REPLACE)\b/gi,
  /--|;|\/\*|\*\/|@@|@/g,
  /\0/g
]

export function validateUserInput(input: string): { safe: boolean; sanitized: string } {
  if (typeof input !== 'string') return { safe: false, sanitized: '' }

  const sanitized = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim()

  const isSafe = validator.isAscii(sanitized) &&
                 !dangerousPatterns.some(p => p.test(sanitized))

  return {
    safe: isSafe,
    sanitized
  }
}
