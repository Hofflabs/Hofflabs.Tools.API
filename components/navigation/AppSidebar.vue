<script setup lang="ts">

import GeneralSettingsDialog from '../settings/GeneralSettingsDialog.vue'
import TeamSettingsDialog from '../settings/TeamSettingsDialog.vue'
import ModuleSettingsDialog from '../settings/ModuleSettingsDialog.vue'
import ConfigurationSettingsDialog from '../settings/ConfigurationSettingsDialog.vue'
import { ref } from 'vue'

const openGeneralSettingsDialog = ref(false)
const openTeamSettingsDialog = ref(false)
const openModuleSettingsDialog = ref(false)
const openConfigurationSettingsDialog = ref(false)

import type { SidebarProps } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import NavSecondary from '@/components/navigation/NavSecondary.vue'
import NavMain from '@/components/navigation/NavMain.vue'
import NavUser from '@/components/navigation/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import {
  GalleryVerticalEnd,
  Plus,
} from 'lucide-vue-next'

import * as icons from 'lucide-vue-next'
import { isCommaListExpression } from 'typescript'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// This is sample data.
const sidebarData = {
  user: {
    name: 'coming soon',
    email: 'admin@domain.com',
    avatar: '_nuxt/components/avatars/profile.jpg',
  },
  navMain: [
    {
      title: 'Develop',
      url: '#',
      icon: icons.SquareTerminal,
      items: [
        {
          title: 'Viewer',
          url: '/viewer',
        },
        {
          title: 'Permissions',
          url: '#',
        },
      ],
    },
    {
      title: 'Metrics',
      url: 'https://google.com',
      icon: icons.ChartNoAxesCombined,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/',
        },
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: icons.BookOpen,
      items: [
        {
          title: 'Swagger',
          url: '#',
        },
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
  title: 'Settings',
  icon: icons.Settings2,
  items: [
    {
      title: 'General',
      action: () => openGeneralSettingsDialog.value = true,
    },
    {
      title: 'Team',
      action: () => openTeamSettingsDialog.value = true,
    },
    {
      title: 'Modules',
      action: () => openModuleSettingsDialog.value = true,
    },
    {
      title: 'Configuration',
      action: () => openConfigurationSettingsDialog.value = true,
    },
  ],
},

  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: icons.Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: icons.PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: icons.Map,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: icons.LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: icons.Send,
    },
  ],
}
</script>

<template>
  <ScrollArea>
    <Sidebar v-bind="props">
      <!-- <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4"> -->
      <SidebarHeader>

        <SidebarMenuButton size="lg" as-child>
          <a href="/">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-semibold">Hofflabs API</span>
              <span class="">v0.0.1 | Beta Version</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain :items="sidebarData.navMain" />
        <!-- <NavProjects :projects="sidebarData.projects" /> -->
        <NavSecondary :items="sidebarData.navSecondary" class="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton>
          <Plus />
          <span>Create Project</span>
        </SidebarMenuButton>
        <NavUser :user="sidebarData.user" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  </ScrollArea>
  <GeneralSettingsDialog v-if="openGeneralSettingsDialog" @update:open="openGeneralSettingsDialog = $event" />
  <TeamSettingsDialog v-if="openTeamSettingsDialog" @update:open="openTeamSettingsDialog = $event" />
  <ModuleSettingsDialog v-if="openModuleSettingsDialog" @update:open="openModuleSettingsDialog = $event" />
  <ConfigurationSettingsDialog v-if="openConfigurationSettingsDialog" @update:open="openConfigurationSettingsDialog = $event" />
</template>
