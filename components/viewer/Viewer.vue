<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import { ref } from 'vue'

// ✅ Independent collapsed state
const isCollapsed = ref(false)
</script>

<template>
    <div class="flex flex-1 h-full overflow-hidden">
        <!-- ✅ Nested Sidebar -->
        <div :class="[
            'transition-all duration-300',
            isCollapsed ? 'w-14' : 'w-64',
            'shrink-0 border-r bg-muted/50 h-full flex flex-col'
        ]">
            <!-- ✅ Collapse Toggle Button -->
            <Button variant="ghost" size="icon" class="m-2" @click="isCollapsed = !isCollapsed"
                :title="isCollapsed ? 'Expand' : 'Collapse'">
                <ChevronLeft class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isCollapsed }" />
            </Button>


            <!-- ✅ Sidebar Content -->
            <AppSidebar v-show="!isCollapsed" collapsible="none" class="flex-1 overflow-auto" />
        </div>

        <!-- ✅ File Viewer -->
        <div class="flex-1 p-4 overflow-auto bg-muted/50">
            <div class="h-full w-full rounded-lg border bg-background p-4">
                <p class="text-muted-foreground">This is your file Viewer area.</p>
            </div>
        </div>
    </div>
</template>
