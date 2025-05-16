import { readBody } from 'h3'
import { loginUser } from '../../database/sqlite/user/login'
import { validateUserInput } from '../../utils/validateUserInput'
import validator from 'validator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { success: false, user: null }
  }

  if (!validator.isEmail(email)) {
    return { success: false, user: null }
  }

  if (password.length < 8 || password.length > 128) {
    return { success: false, user: null }
  }

  const cleanEmail = validateUserInput(email)
  if (!cleanEmail.safe) {
    return { success: false, user: null }
  }

  const user = loginUser(cleanEmail.sanitized, password)

  return {
    success: true,
    user
  }
})
