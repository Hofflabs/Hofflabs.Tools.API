<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { Check, Circle, Dot } from 'lucide-vue-next'
import { h, ref, onMounted } from 'vue'
import * as z from 'zod'
const config = useRuntimeConfig()

const placeholder = computed(() => {
  const host = config.public.host
  const port = config.public.port
  return `e.g. http://${host}:${port}`
})

const acceptedTerms = ref(false)
const encryptionKey = ref('')

const setupData = ref({
  acceptedTerms: false,
  database: {
    db: 'sqlite',
  },
  account: {},
})


onMounted(() => {
  if (!encryptionKey.value) {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    encryptionKey.value = btoa(String.fromCharCode(...array))
  }
})

async function testDbConnection(payload: any): Promise<boolean> {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ db: payload.db }),
    })
    const data = await response.json()
    return response.ok && data?.connection?.internal !== undefined
  } catch (e) {
    console.error('DB connection test failed:', e)
    return false
  }
}


function copyKey() {
  navigator.clipboard.writeText(encryptionKey.value)
  toast('Encryption key copied to clipboard', {
    action: {
      label: 'Close',
      onClick: () => toast.dismiss(), // closes the toast
    },
  })

}

const userInfo = ref({
  userAgent: '',
  ip: 'Fetching...',
  geoRegion: 'Unknown',
  timestampUtc: ''
})

onMounted(async () => {
  userInfo.value.userAgent = navigator.userAgent
  userInfo.value.timestampUtc = new Date().toISOString()

  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const ipData = await res.json()
    userInfo.value.ip = ipData.ip
  } catch {
    userInfo.value.ip = 'Unavailable'
  }

  try {
    const res = await fetch('https://ipapi.co/json/')
    const geoData = await res.json()
    userInfo.value.geoRegion = geoData.region || 'Unknown'
  } catch { }
})

const selectedDb = ref<DBType>('sqlite')

const dbSchemas: Record<DBType, z.ZodRawShape> = {
  sqlite: {
    connectionUrl: z.string().url({ message: 'Must be a valid URL' }),
  },
  postgres: {
    host: z.string().min(1),
    port: z.string().regex(/^\d+$/, 'Port must be a number'),
    user: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
  },
  mysql: {
    host: z.string().min(1),
    port: z.string().regex(/^\d+$/, 'Port must be a number'),
    user: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
  },
  rds: {
    endpoint: z.string().url(),
    user: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
  },
  gcloud: {
    instanceConnectionName: z.string().min(1),
    user: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
  },
}

const dbEnumValues = ['sqlite', 'postgres', 'mysql', 'rds', 'gcloud'] as const
type DBType = typeof dbEnumValues[number]
const dbOptions = dbEnumValues

const formSchema = computed(() => [
  z.object({
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue.' }),
    }),
  }),
  z.object({
    db: z.enum(dbOptions),
    ...(dbSchemas[selectedDb.value] || {}),
  }),
  z.object({
  displayName: z.string(),
  email: z.string().email(),
  password: z.string().min(2).max(50),
  confirmPassword: z.string(),
}).refine(
  (values) => values.password === values.confirmPassword,
  {
    message: 'Passwords must match!',
    path: ['confirmPassword'],
  },
),
])

const stepIndex = ref(1)

const steps = [
  { step: 1, title: 'Terms/Privacy' },
  { step: 2, title: 'Connection' },
  { step: 3, title: 'Create Account' },
  { step: 4, title: 'Confirm' },
]

function onSubmit(values: any) {
  console.log('test')
  console.log(JSON.stringify(values, null, 2))
  toast('Event has been created', {
    description: 'Sunday, December 03, 2023 at 9:00 AM',
    action: {
      label: 'Undo',
      onClick: () => console.log('Undo'),
    },
  })
  toast('All form values submitted', {
    description: h('pre', {
      class: 'mt-2 max-h-[300px] overflow-auto text-left w-full bg-slate-950 p-4 rounded text-white text-sm',
    }, JSON.stringify(values, null, 2)),
  })
}
</script>

<template>
  <Card class="max-w-2xl mx-auto">
    <CardContent>
      <Form v-slot="{ meta, values, validate }" :key="stepIndex" keep-values
      :initial-values="stepIndex === 2 
  ? { db: 'sqlite', connectionUrl: config.public.apiUrl } 
  : stepIndex === 3 
    ? setupData.account 
    : { acceptedTerms: acceptedTerms }">
        <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex" class="block w-full">
          <form @submit.prevent="async () => {
  const currentSchema = formSchema[stepIndex - 1]

  const parsed = await currentSchema.safeParseAsync(values)

  if (stepIndex === 1 && !acceptedTerms) {
    toast.error('You must accept the terms to continue.')
    return
  }

  if (stepIndex === 2) {
    if (selectedDb === 'sqlite') {
      values.connectionUrl = config.public.apiUrl
    }

    const dbPayload = { db: selectedDb, ...values }
    setupData.database = dbPayload

    const success = await testDbConnection(dbPayload)
    if (!success) {
      toast.error('Database connection failed. Please check your configuration.')
      return
    } else {
      toast.success('Database connection established.')
    }
  }

  if (stepIndex === 3) {
  if (values.password !== values.confirmPassword) {
    toast.error('Passwords do not match.')
    return
  }
  setupData.account = { ...values }
}

if (!parsed.success) {
    toast.error('Please complete the required fields.')
    // trigger vee-validate's internal error rendering
    await validate()
    return
  }

  if (stepIndex < steps.length) {
    stepIndex++
  } else {
    const finalData = {
      ...setupData,
      encryptionKey: encryptionKey,
      userInfo: userInfo,
    }
    onSubmit(finalData)
  }
}">








            <div class="flex w-full flex-start gap-2">
              <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
                class="relative flex w-full flex-col items-center justify-center" :step="step.step">
                <StepperSeparator v-if="step.step !== steps[steps.length - 1].step"
                  class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

                <StepperTrigger as-child>
                  <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon"
                    class="z-10 rounded-full shrink-0 pointer-events-none opacity-60"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                    <Check v-if="state === 'completed'" class="size-5" />
                    <Circle v-if="state === 'active'" />
                    <Dot v-if="state === 'inactive'" />
                  </Button>
                </StepperTrigger>

                <div class="mt-5 flex flex-col items-center text-center">
                  <StepperTitle :class="[state === 'active' && 'text-primary']"
                    class="text-sm font-semibold transition lg:text-base">
                    {{ step.title }}
                  </StepperTitle>
                  <StepperDescription :class="[state === 'active' && 'text-primary']"
                    class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
                  </StepperDescription>
                </div>
              </StepperItem>
            </div>

            <div class="flex flex-col gap-4 mt-4">
              <template v-if="stepIndex === 1">
                <p class="text-sm text-muted-foreground mb-2">
                  Hofflabs does not collect data from self-hosted platforms. By proceeding, you agree to our Terms of Use
                  and Privacy Policy. We reserve the right to monitor activity on platforms officially hosted by
                  Hofflabs. By proceeding you agree to share the following data with Hofflabs.
                </p>
                <pre class="bg-muted text-sm p-4 rounded border overflow-auto max-w-full">
{{ JSON.stringify(userInfo, null, 2) }}
                </pre>

                <!-- <p class="text-xs text-muted-foreground">Accepted: {{ acceptedTerms }}</p> -->
                <FormField name="acceptedTerms" v-slot="{ value, componentField }">
                  <FormItem>
                    <div class="flex items-center space-x-2">
                      <FormControl>
                        <input id="terms" type="checkbox" class="h-4 w-4" :checked="value" @change="(e) => {
                          const checked = (e.target as HTMLInputElement).checked
                          acceptedTerms = checked
                          componentField.onChange(checked)
                        }" />
                      </FormControl>
                      <FormLabel for="terms" class="text-sm font-medium leading-none">
                        I accept the terms
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <template v-if="stepIndex === 2">
                <!-- Step 2: Dynamic Database Configuration -->
                <FormField v-slot="{ componentField }" name="db">
                  <FormItem>
                    <FormLabel>Database Type</FormLabel>
                    <Select v-bind="componentField" :model-value="selectedDb" @update:modelValue="(val) => {
                      if (val !== null && typeof val === 'string') {
                        selectedDb = val as DBType
                        componentField.onChange(val)
                      }
                    }">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select database" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                          <SelectItem value="postgres" disabled>PostgreSQL (coming soon)</SelectItem>
                          <SelectItem value="mysql" disabled>MySQL (coming soon)</SelectItem>
                          <SelectItem value="rds" disabled>Amazon RDS (coming soon)</SelectItem>
                          <SelectItem value="gcloud" disabled>Google Cloud SQL (coming soon)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="selectedDb === 'sqlite'" v-slot="{ componentField }" name="connectionUrl">
  <FormItem>
    <FormLabel>Connection URL</FormLabel>
    <FormDescription>Pulled from the .env file</FormDescription>
    <FormControl>
      <Input
        type="text"
        :model-value="config.public.apiUrl"
        readonly
        class="cursor-not-allowed bg-gray-100"
        @input="componentField.onChange(config.public.apiUrl)"
      />
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>

                <!-- Conditionally Rendered DB Fields -->
                <div v-if="selectedDb !== 'sqlite'" class="space-y-4">
                  <FormField v-if="'host' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="host">
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'port' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="port">
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'endpoint' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="endpoint">
                    <FormItem>
                      <FormLabel>Endpoint</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'instanceConnectionName' in dbSchemas[selectedDb]" v-slot="{ componentField }"
                    name="instanceConnectionName">
                    <FormItem>
                      <FormLabel>Instance Connection Name</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'user' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="user">
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'password' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-if="'database' in dbSchemas[selectedDb]" v-slot="{ componentField }" name="database">
                    <FormItem>
                      <FormLabel>Database Name</FormLabel>
                      <FormControl><Input v-bind="componentField" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

              </template>

              <template v-if="stepIndex === 3">
                <FormField v-slot="{ componentField }" name="displayName">
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="confirmPassword">
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>
              <template v-if="stepIndex == 4">
                <div class="space-y-4">
                  <p class="text-sm text-muted-foreground">
                    Below is your unique encryption key. It is used to encrypt and recover sensitive data.
                    <strong class="text-red-500">If you lose this key, your data cannot be recovered.</strong>
                    Please store it securely.
                  </p>

                  <div class="bg-muted border rounded p-4 text-sm font-mono flex items-center justify-between">
                    <span class="break-all">{{ encryptionKey }}</span>
                    <Button type="button" size="sm" variant="ghost" @click="copyKey">Copy</Button>
                  </div>
                </div>
              </template>

            </div>

            <div class="flex items-center justify-between mt-4">
              <Button :disabled="stepIndex <= 1" variant="outline" size="sm" @click="() => {
                if (stepIndex === 2) {
                  setupData.database = { db: selectedDb, ...values }
                } else if (stepIndex === 3) {
                  setupData.account = { ...values }
                }
                stepIndex--
              }">
                Back
              </Button>
              <div class="flex items-center gap-3">
                <Button v-if="stepIndex !== steps.length" size="sm" type="submit">
                  Next
                </Button>
                <Button v-if="stepIndex === steps.length" size="sm" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Stepper>
      </Form>
    </CardContent>
  </Card>
</template>
