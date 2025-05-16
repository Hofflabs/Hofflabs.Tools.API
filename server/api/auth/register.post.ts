import { readBody, createError } from 'h3'
import { registerUser } from '../../database/sqlite/user/register'
import { validateUserInput } from '../../utils/validateUserInput'
import validator from 'validator'

const allowedLanguages = ['en', 'es', 'fr', 'de', 'ja']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (
    typeof body.username !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.password !== 'string'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid fields.' })
  }

  if (!validator.isEmail(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address.' })
  }

  if (body.password.length < 8 || body.password.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be 8–128 characters.' })
  }

  const usernameValidation = validateUserInput(body.username)
  if (!usernameValidation.safe) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or unsafe username.' })
  }

  const language = allowedLanguages.includes(body.language) ? body.language : 'en'

  const user = await registerUser({
    username: usernameValidation.sanitized,
    email: body.email,
    password: body.password,
    language,
    termsAccepted: !!body.terms,
    privacyAccepted: !!body.privacy,
  })

  return {
    success: true,
    user
  }
})
