<script lang="ts">
export const description = 'Admin setup flow with env, db, and user checks.'
export const iframeHeight = '600px'
export const containerClass = 'w-full h-screen flex items-center justify-center px-4'
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const loading = ref(false)
const initializing = ref(true)
const step = ref<'checking-env' | 'checking-db' | 'creating-admin' | 'complete'>('checking-env')
const missingTables = ref<string[]>([])
const errorMessage = ref('')
const successMessage = ref('')

// Form fields
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const language = ref('en')
const terms = ref(false)
const privacy = ref(false)

onMounted(async () => {
  try {
    // Step 1: validate .env
    const envCheck = await $fetch<{ valid: boolean; missing?: string[] }>('/api/install/validate-env')
    if (!envCheck.valid) {
      errorMessage.value = `Missing or invalid env vars: ${envCheck.missing?.join(', ')}`
      initializing.value = false
      return
    }

    step.value = 'checking-db'

    // Step 2: check tables
    const tableCheck = await $fetch<{ allReady: boolean; missing: string[] }>('/api/install/check-tables')
    if (!tableCheck.allReady) {
      missingTables.value = tableCheck.missing
      await $fetch('/api/install/create-tables', { method: 'POST' })
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    // Step 3: check for existing admin
    const adminCheck = await $fetch<{ adminExists: boolean }>('/api/install/admin-exists')
    if (adminCheck.adminExists) {
      step.value = 'complete'
      return
    }

    step.value = 'creating-admin'
  } catch (e) {
    errorMessage.value = 'Fatal error during installation.'
  } finally {
    initializing.value = false
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
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

    await $fetch('/api/install/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
        language: language.value,
        terms: terms.value,
        privacy: privacy.value,
        role: 'admin'
      }
    })

    successMessage.value = 'Admin account created!'
    setTimeout(() => step.value = 'complete', 2000)
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'An error occurred.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4 bg-[#0d0d0d]">
    <!-- Step: Initialization -->
    <template v-if="initializing">
      <Card class="w-full max-w-md bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-md px-6 py-8">
        <div class="text-center space-y-4">
          <div class="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 class="text-xl font-semibold text-white">Initializing...</h2>
          <p class="text-sm text-neutral-400">
            Setting up system resources. Please wait a moment.
          </p>
          <ul v-if="missingTables.length" class="mt-4 text-sm text-neutral-400 text-left list-disc list-inside">
            <li v-for="table in missingTables" :key="table">Creating table: {{ table }}</li>
          </ul>
        </div>
      </Card>
    </template>

    <!-- Step: Create Admin -->
    <template v-else-if="step === 'creating-admin'">
      <Card class="w-full max-w-lg bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-md px-6 py-8">
        <div class="text-center mb-6 space-y-2">
          <h2 class="text-2xl font-semibold text-white">Create Admin Account</h2>
          <p class="text-sm text-neutral-400">Enter details to create the first admin account</p>
        </div>

        <CardContent class="space-y-4">
          <form class="space-y-4" @submit.prevent="handleSubmit">
  <div class="space-y-1">
    <Label for="username" class="text-white">Username</Label>
    <Input id="username" type="text" v-model="username" required />
  </div>

  <div class="space-y-1">
    <Label for="email" class="text-white">Email</Label>
    <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
  </div>

  <div class="space-y-1">
    <Label for="password" class="text-white">Password</Label>
    <Input id="password" type="password" v-model="password" required />
  </div>

  <div class="space-y-1">
    <Label for="confirm-password" class="text-white">Confirm Password</Label>
    <Input id="confirm-password" type="password" v-model="confirmPassword" required />
  </div>

  <div class="space-y-1">
    <Label for="language" class="text-white">Language</Label>
    <select
  id="language"
  v-model="language"
  class="w-full rounded-md border border-neutral-700 bg-[#1e1e1e] text-sm text-white px-3 py-2 focus:ring-1 focus:outline-none focus:ring-green-500"
>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
  <option value="de">Deutsch</option>
  <option value="ja">日本語</option>
</select>
  </div>

  <div class="flex items-center gap-2 text-neutral-300 text-sm">
    <input type="checkbox" id="terms" v-model="terms" />
    <label for="terms">I accept the Terms of Service</label>
  </div>

  <div class="flex items-center gap-2 text-neutral-300 text-sm">
    <input type="checkbox" id="privacy" v-model="privacy" />
    <label for="privacy">I accept the Privacy Policy</label>
  </div>

  <Button class="w-full mt-2" type="submit" :disabled="loading">
    Create Admin
  </Button>

  <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
  <p v-if="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</p>
</form>

        </CardContent>

        <CardFooter class="text-center mt-6">
          <p class="text-xs text-neutral-500">
            This will create your system’s first administrator account.
          </p>
        </CardFooter>
      </Card>
    </template>

    <!-- Step: Complete -->
    <template v-else-if="step === 'complete'">
      <Card class="mx-auto w-full max-w-lg bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-md px-6 py-8">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-14 h-14 rounded-full bg-green-600/10 flex items-center justify-center">
              <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <h2 class="text-2xl font-semibold text-white">Setup Complete</h2>
          <p class="text-sm text-neutral-400 max-w-md mx-auto">
            Your admin account has been successfully created. The application is now configured and ready.
          </p>
        </div>

        <div class="mt-8 bg-[#121212] border border-neutral-800 rounded-lg px-5 py-4 space-y-2">
          <h3 class="text-sm font-medium text-white mb-2">Final steps:</h3>
          <ul class="list-disc list-inside text-sm text-neutral-300 space-y-1">
            <li>
              Delete <code class="bg-[#1e1e1e] px-1.5 py-0.5 rounded-md text-xs border border-neutral-700 text-white">/pages/install</code>
            </li>
            <li>
              Delete <code class="bg-[#1e1e1e] px-1.5 py-0.5 rounded-md text-xs border border-neutral-700 text-white">/server/api/install</code>
            </li>
            <li>Restart your app server to finalize setup and lock the installer.</li>
          </ul>
        </div>

        <div class="mt-6 text-sm text-center text-neutral-400">
          <p class="mb-1">Once deleted, <code class="text-xs bg-[#2a2a2a] px-1 py-0.5 rounded text-neutral-300">/install</code> will no longer be accessible.</p>
          <p class="text-xs italic text-neutral-500">You’ll see a 404 page if you refresh this screen after cleanup.</p>
        </div>

        <CardFooter class="mt-6 flex justify-center">
          <Button disabled class="opacity-50 bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed">
            Installation Locked
          </Button>
        </CardFooter>
      </Card>
    </template>
  </div>
</template>

