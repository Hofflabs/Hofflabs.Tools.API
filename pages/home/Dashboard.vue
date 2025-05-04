<script lang="ts">
export const description
  = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang="ts">
import AppSidebar from '../../components/navigation/AppSidebar.vue'
import ThemeToggle from '../../components/navigation/ThemeToggle.vue'
import { Label } from '../../components/ui/label'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb'
import { Separator } from '../../components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../../components/ui/sidebar'

import { DonutChart } from '../../components/ui/chart-donut'
import { AreaChart } from '../../components/ui/chart-area'
// import CustomChartTooltip from './CustomChartTooltip.vue'

const number = 2


const totalConnectionData = [
  { name: 'Jan', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Feb', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Mar', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Apr', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'May', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jun', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jul', Internal: Math.floor(Math.random() * 2000) + 500, External: Math.floor(Math.random() * 2000) + 500 },
]

const blockedData = [
  { name: 'Blocked', connections: number },
  { name: 'Allowed', connections: 1 },
]

const nodesData = [
  { name: 'Offline', connections: number },
  { name: 'Online', connections: 1 },
]

const browserData = [
  { name: 'Chrome', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Safari', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Edge', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Firefox', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Other', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

const nodeTrafficData = [
  { name: 'Node 1', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Node 2', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Node 3', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Node 4', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

const applicationTrafficData = [
  { name: 'Authentication', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Forums', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Hub', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'AI', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Search', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

const visitorRegionData = [
  { name: 'North America', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Europe', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Asia', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'South America', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Africa', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Oceania', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Middle East', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Other', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <!-- <BreadcrumbSeparator class="hidden md:block" /> -->
              <!-- <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem> -->
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Push ThemeToggle to the far right -->
        <div class="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Browsers
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'total'" :colors="[
                  '#DB4437', // Chrome (red)
                  '#F5F5F7', // Safari (apple silver)
                  '#0078D7', // Edge (blue)
                  '#FF7139', // Firefox (orange)
                  '#6C757D'  // Other (neutral gray)
                ]" :data="browserData" :type="'pie'" class="w-full h-full" />
              </div>
            </div>
          </div>
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Connections Blocked
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'connections'" :colors="['#1E90FF', 'mediumseagreen']"
                  :data="blockedData" class="w-full h-full" />
              </div>
            </div>
          </div>
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Visitor Regions
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'total'" :colors="[
                  '#1E90FF', // North America
                  '#4B0082', // Europe
                  '#FF7F50', // Asia
                  '#32CD32', // South America
                  '#228B22', // Africa
                  '#20B2AA', // Oceania
                  '#FFD700', // Middle East
                  '#A0AEC0', // Other
                ]" :data="visitorRegionData" class="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
        <div class="min-h-[100vh] flex flex-col flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div class="flex flex-1 flex-col p-4">
            <Label for="email" class="block text-sm font-medium text-muted-foreground mb-4 text-center">
              Total Connections
            </Label>
            <div class="flex-1 min-h-0 relative">
              <AreaChart index="name" :data="totalConnectionData" :categories="['Internal', 'External']"
                :colors="['#00bfff', 'mediumseagreen']" class="absolute inset-0 w-full h-full" />
            </div>
          </div>
        </div>
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Application Traffic
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'total'" :data="applicationTrafficData" :type="'pie'"
                  class="w-full h-full" />
              </div>
            </div>
          </div>
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Node Traffic
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'total'" :data="nodeTrafficData" :type="'pie'"
                  class="w-full h-full" />
              </div>
            </div>
          </div>
          <div class="rounded-xl bg-muted/50 p-0 flex overflow-hidden min-h-52 w-full max-w-full [aspect-ratio:16/9]">
            <div class="flex flex-col w-full h-full p-2 min-w-0 min-h-0">
              <Label class="text-sm font-medium text-muted-foreground text-center">
                Nodes Online
              </Label>
              <div class="flex-1 min-w-0 min-h-0">
                <DonutChart index="name" :category="'connections'" :colors="['#ff6666', 'mediumseagreen']"
                  :data="nodesData" class="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

