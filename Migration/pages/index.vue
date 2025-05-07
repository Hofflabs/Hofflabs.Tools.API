<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import Dashboard from './home/dashboard.vue'
import InitialSetup from './config/initial-setup.vue'

const configExists = ref<boolean | null>(null)
const config = useRuntimeConfig()

onMounted(async () => {
  try {
    const res = await fetch(`${config.public.apiUrl}/api/check-config`)
    const data = await res.json()
    configExists.value = data.exists
  } catch (err) {
    console.error('DB check failed:', err)
    configExists.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <InitialSetup v-if="configExists === false" />
    <Dashboard v-else-if="configExists === true" />
    <div v-else class="animate-pulse text-gray-500">Loading setup...</div>
  </div>
</template>

