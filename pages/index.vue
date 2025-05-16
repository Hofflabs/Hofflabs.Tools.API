<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import Dashboard from './home/dashboard.vue'
import Login from './dialog/login.vue';

const router = useRouter()
const config = useRuntimeConfig()

onMounted(async () => {
  try {
    const res = await fetch(`${config.public.apiUrl}/install`, {
      method: 'HEAD'
    })
    if (res.ok) {
      // Redirect if /install exists
      router.push('/install')
      return
    }
  } catch (err) {
    // console.error('Install page check failed:', err)
  }
})
</script>

<template>
  <div class="p-6">
    <!-- <Dashboard /> -->
    <Login/>
  </div>
</template>
