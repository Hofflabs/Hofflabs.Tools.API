<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'

</script>

<template>
  <Toaster />
    <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
