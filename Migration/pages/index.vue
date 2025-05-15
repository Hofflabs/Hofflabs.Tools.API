<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import Dashboard from './home/dashboard.vue'
// import InitialSetup from './config/initial-setup.vue'

const configExists = ref<boolean | null>(null)
const config = useRuntimeConfig()

onMounted(async () => {
  try {
    const res = await fetch(`${config.public.apiUrl}/api/check-config`)
    const data = await res.json()
    console.log(data);
    configExists.value = true//data.exists
  } catch (err) {
    console.error('DB check failed:', err)
    configExists.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <Dashboard v-if="configExists === true" />
    <Dashboard v-else-if="configExists === false" />
    <div v-else class="animate-pulse text-gray-500">Initializing..</div>
  </div>
</template>

