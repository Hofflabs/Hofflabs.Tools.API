<script lang="ts">
export const description = 'A sidebar in a dialog.'
export const iframeHeight = '800px'
</script>

<script setup lang="ts">
import SettingsDialog from '@/components/settings/TeamSettingsDialog.vue'
</script>

<template>
  <div class="flex h-svh items-center justify-center">
    <SettingsDialog />
  </div>
</template>
