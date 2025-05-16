<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { Check, Circle, Dot } from 'lucide-vue-next'
import { h, ref, onMounted } from 'vue'
import * as z from 'zod'

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
  } catch {}
})

const formSchema = [
  z.object({
    accepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept to continue.' }),
    }),
  }),
  z.object({
    dbType: z.union([z.literal('sqlite'), z.literal('postgres')]),
  }),
  z.object({
    username: z.string().min(1),
    password: z.string().min(6),
  }),
  z.object({}),
]

const stepIndex = ref(1)
const steps = [
  {
    step: 1,
    title: 'Terms',
    description: 'Accept terms of use',
  },
  {
    step: 2,
    title: 'Database',
    description: 'Select a database',
  },
  {
    step: 3,
    title: 'Admin Account',
    description: 'Create your admin account',
  },
  {
    step: 4,
    title: 'Confirm',
    description: 'Finish setup',
  },
]

function onSubmit(values: any) {
  toast(
    h('div', {}, [
      h('p', { class: 'font-medium' }, 'You submitted the following values:'),
      h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto text-white text-sm' },
        JSON.stringify(values, null, 2)
      )
    ])
  )
}
</script>

<template>
  <Card class="max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>Initial Setup</CardTitle>
    </CardHeader>
    <CardContent>
      <Form
        v-slot="{ meta, values, validate }"
        as="" keep-values :validation-schema="toTypedSchema(formSchema[stepIndex - 1])"
      >
        <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex" class="block w-full">
          <form
            @submit="(e) => {
              e.preventDefault()
              validate()

              if (stepIndex === steps.length && meta.valid) {
                onSubmit(values)
              }
            }"
          >
            <div class="flex w-full flex-start gap-2">
              <StepperItem
                v-for="step in steps"
                :key="step.step"
                v-slot="{ state }"
                class="relative flex w-full flex-col items-center justify-center"
                :step="step.step"
              >
                <StepperSeparator
                  v-if="step.step !== steps[steps.length - 1].step"
                  class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                />

                <StepperTrigger as-child>
                  <Button
                    :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                    size="icon"
                    class="z-10 rounded-full shrink-0"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                    :disabled="state !== 'completed' && !meta.valid"
                  >
                    <Check v-if="state === 'completed'" class="size-5" />
                    <Circle v-if="state === 'active'" />
                    <Dot v-if="state === 'inactive'" />
                  </Button>
                </StepperTrigger>

                <div class="mt-5 flex flex-col items-center text-center">
                  <StepperTitle
                    :class="[state === 'active' && 'text-primary']"
                    class="text-sm font-semibold transition lg:text-base"
                  >
                    {{ step.title }}
                  </StepperTitle>
                  <StepperDescription
                    :class="[state === 'active' && 'text-primary']"
                    class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                  >
                    {{ step.description }}
                  </StepperDescription>
                </div>
              </StepperItem>
            </div>

            <div class="flex flex-col gap-4 mt-4">
              <template v-if="stepIndex === 1">
                <p class="text-sm text-muted-foreground mb-2">
                  Hofflabs does not collect data from self-hosted platforms. By proceeding, you agree to our Terms of Use and Privacy Policy.
            We reserve the right to monitor activity only on platforms officially hosted by Hofflabs. By proceeding you agree to share the following data with Hofflabs.
                </p>
                <pre class="bg-muted text-sm p-4 rounded border overflow-auto max-w-full">
{{ JSON.stringify(userInfo, null, 2) }}
                </pre>
                <FormField v-slot="{ value, handleChange }" name="accepted">
                  <FormItem>
                    <FormControl>
                      <div class="flex items-center space-x-2">
                        <Checkbox id="terms" :checked="value" @update:checked="handleChange" />
                        <label
                          for="terms"
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I accept the terms
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <template v-if="stepIndex === 2">
                <FormField v-slot="{ componentField }" name="dbType">
                  <FormItem>
                    <FormLabel>Database</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a database" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                          <SelectItem value="postgres">PostgreSQL</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <template v-if="stepIndex === 3">
                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>Admin Username</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
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
              </template>

              <template v-if="stepIndex === 4">
                <p class="mb-2 font-semibold">All set!</p>
                <p class="text-muted-foreground">Click submit to finish setup and launch your dashboard.</p>
              </template>
            </div>

            <div class="flex items-center justify-between mt-4">
              <Button :disabled="isPrevDisabled" variant="outline" size="sm" @click="prevStep()">
                Back
              </Button>
              <div class="flex items-center gap-3">
                <Button v-if="stepIndex !== steps.length" :type="meta.valid ? 'button' : 'submit'" :disabled="isNextDisabled" size="sm" @click="meta.valid && nextStep()">
                  Next
                </Button>
                <Button
                  v-if="stepIndex === steps.length" size="sm" type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Stepper>
      </Form>
    </CardContent>
    <CardFooter />
  </Card>
</template>
