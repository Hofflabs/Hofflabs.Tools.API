<script lang="ts">
export const description = 'A sidebar with a collapsible file tree.'
export const iframeHeight = '800px'
</script>

<script setup lang="ts">
import AppSidebar from '@/components/navigation/AppSidebar.vue' // Outer sidebar
import ThemeToggle from '@/components/navigation/ThemeToggle.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import Viewer from '@/components/viewer/Viewer.vue' // Includes nested file sidebar
</script>

<template>
  <SidebarProvider>
    <!-- ✅ Outer (Dashboard) Sidebar -->
    <AppSidebar />

    <!-- ✅ Layout wrapper for header + content -->
    <SidebarInset>
      <!-- ✅ Top header bar with breadcrumbs + sidebar trigger -->
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" /> <!-- Sidebar toggle -->
        <Separator orientation="vertical" class="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="/viewer">Viewer</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>button.tsx</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <!-- Optional: theme toggle or other actions -->
        <div class="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <!-- ✅ Content area with nested sidebar + file Viewer -->
      <div class="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <Viewer />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
