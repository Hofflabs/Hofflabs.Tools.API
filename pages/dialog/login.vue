<script lang="ts">
export const description =
  'Toggleable login and registration form inside a card. Switches between login and sign up with a single toggle.'
export const iframeHeight = '600px'
export const containerClass = 'w-full h-screen flex items-center justify-center px-4'
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const language = ref('en')
const terms = ref(false)
const privacy = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    if (isRegister.value) {
      if (!terms.value || !privacy.value) {
        errorMessage.value = 'You must accept terms and privacy policy.'
        loading.value = false
        return
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.'
        loading.value = false
        return
      }

      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          username: username.value,
          email: email.value,
          password: password.value,
          language: language.value,
          terms: terms.value,
          privacy: privacy.value
        }
      })

      successMessage.value = 'Account created!'
      isRegister.value = false
    } else {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value
        }
      })
      if(res.success) {
        successMessage.value = 'Login successful'
        router.push('/dashboard')
      }
      else {
        errorMessage.value = 'Login failed..'
      }
    }
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'An error occurred.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <Card class="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle class="text-2xl">
          {{ isRegister ? 'Sign Up' : 'Login' }}
        </CardTitle>
        <CardDescription>
          {{ isRegister
            ? 'Enter your information to create an account'
            : 'Enter your email below to login to your account.' }}
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4">
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <template v-if="isRegister">
            <div class="grid gap-2">
              <Label for="username">Username</Label>
              <Input id="username" type="text" v-model="username" />
            </div>
          </template>

          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" v-model="email" />
          </div>

          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="password" />
          </div>

          <template v-if="isRegister">
            <div class="grid gap-2">
              <Label for="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" v-model="confirmPassword" />
            </div>

            <div class="grid gap-2">
              <Label for="language">Language</Label>
              <select
                id="language"
                v-model="language"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" id="terms" v-model="terms" />
              <label for="terms">I accept the Terms of Service</label>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="privacy" v-model="privacy" />
              <label for="privacy">I accept the Privacy Policy</label>
            </div>
          </template>

          <Button class="w-full" type="submit" :disabled="loading">
            {{ isRegister ? 'Create an account' : 'Sign in' }}
          </Button>

          <p v-if="errorMessage" class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-600 text-sm text-center">{{ successMessage }}</p>
        </form>
      </CardContent>

      <CardFooter class="text-center text-sm flex justify-center">
        <span>
          {{ isRegister ? 'Already have an account?' : 'Don\'t have an account?' }}
          <a href="#" @click.prevent="isRegister = !isRegister" class="underline ml-1">
            {{ isRegister ? 'Sign in' : 'Sign up' }}
          </a>
        </span>
      </CardFooter>
    </Card>
  </div>
</template>
