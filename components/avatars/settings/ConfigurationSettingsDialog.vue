<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  Globe,
  Link,
  Lock,
  Settings,
  PersonStandingIcon,
  PaintRollerIcon,
} from 'lucide-vue-next'
import { ref } from 'vue'

const open = ref(true)
const activeSection = ref('Account')

const data = {
  nav: [
    { name: 'Account', icon: PersonStandingIcon },
    { name: 'Database', icon: Globe },
    { name: 'Themes', icon: PaintRollerIcon },
    { name: 'Connected accounts', icon: Link },
    { name: 'Privacy', icon: Lock },
    { name: 'Advanced', icon: Settings },
  ],
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button size="sm">
        Open Dialog
      </Button>
    </DialogTrigger>
    <DialogContent class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
      <DialogTitle class="sr-only">
        Settings
      </DialogTitle>
      <DialogDescription class="sr-only">
        Customize your settings here.
      </DialogDescription>
      <SidebarProvider class="items-start">
        <Sidebar collapsible="none" class="hidden md:flex">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    v-for="item in data.nav"
                    :key="item.name"
                  >
                    <SidebarMenuButton
                      as-child
                      :is-active="activeSection === item.name"
                    >
                      <button class="w-full text-left" @click="activeSection = item.name">
                        <component :is="item.icon" class="mr-2" />
                        <span>{{ item.name }}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main class="flex h-[480px] flex-1 flex-col overflow-hidden">
          <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div class="flex items-center gap-2 px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem class="hidden md:block">
                    <BreadcrumbLink href="#">
                      Settings
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{{ activeSection }}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
            <div v-if="activeSection === 'Account'" class="p-4 bg-muted/50 rounded-xl">Account settings content here.</div>
            <div v-else-if="activeSection === 'Database'" class="p-4 bg-muted/50 rounded-xl">Database configuration content here.</div>
            <div v-else-if="activeSection === 'Themes'" class="p-4 bg-muted/50 rounded-xl">Theme customization content here.</div>
            <div v-else-if="activeSection === 'Connected accounts'" class="p-4 bg-muted/50 rounded-xl">Connected accounts management here.</div>
            <div v-else-if="activeSection === 'Privacy'" class="p-4 bg-muted/50 rounded-xl">Privacy options content here.</div>
            <div v-else-if="activeSection === 'Advanced'" class="p-4 bg-muted/50 rounded-xl">Advanced settings content here.</div>
          </div>
        </main>
      </SidebarProvider>
    </DialogContent>
  </Dialog>
</template>
