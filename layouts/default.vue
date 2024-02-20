<script setup lang="ts">
import type { UButton } from '#ui-colors/components';
import { appWindow } from '@tauri-apps/api/window';

const isMaximized = ref(true);

async function minimize() {
  await appWindow.minimize();
  isMaximized.value = await appWindow.isMaximized();
}

async function toggleMaximize() {
  appWindow.toggleMaximize();
  isMaximized.value = await appWindow.isMaximized();
}

function close() {
  appWindow.close();
}

onMounted(async () => {
  isMaximized.value = await appWindow.isMaximized()
})
</script>

<template>
  <div
    class="grid w-full min-h-screen transition-all overflow-hidden [grid-template:'head_head'_'body_body'_minmax(0,1fr)_/_1fr_20rem] xl:[grid-template:'head_head'_'body_info'_minmax(0,1fr)_/_1fr_20rem]">
    <header class="header w-full bg-[#1a1928] border-b border-b-[#232235] text-gray-900 h-[2rem] flex items-center pl-1"
      data-tauri-drag-region>
      <div class="pointer-events-none w-full h-full flex-row gap-2 flex items-center justify-center">
        <div class="flex-1 pointer-events-none flex-row gap-0.5 flex items-center">
          <div class="flex flex-row items-center">
            <TopbarAppIndicator />
          </div>
        </div>
        <div class="pointer-events-none">
          <UButton class="pointer-events-auto" color="white" variant="ghost" :padded="false">
            <div class="truncate max-w-[15em] w-full text-center">
              Alfagames
            </div>
          </UButton>
        </div>
        <div class="flex-1 flex items-center !h-full justify-end pointer-events-none">
          <TopbarSettings />
          <div class="ml-4 flex flex-row items-center !h-full">
            <UButton class="pointer-events-auto px-3 hover:!bg-transparent" color="gray" variant="ghost" :padded="false"
              size="xs" @click="minimize">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M14 8v1H3V8z"></path>
              </svg>
            </UButton>
            <UButton class="pointer-events-auto px-3 hover:!bg-transparent" color="gray" variant="ghost" :padded="false"
              size="xs" @click="toggleMaximize">
              <svg v-if="isMaximized" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M3 3v10h10V3zm9 9H4V4h8z"></path>
              </svg>
              <!-- Maximize -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g fill="currentColor">
                  <path d="M3 5v9h9V5zm8 8H4V6h7z"></path>
                  <path fill-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5z" clip-rule="evenodd"></path>
                </g>
              </svg>
            </UButton>
            <UButton class="!pointer-events-auto !h-full px-3 hover:!bg-red-600 hover:text-gray-400 !rounded-none"
              color="gray" variant="ghost" size="xs" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" fill-rule="evenodd"
                  d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z"
                  clip-rule="evenodd"></path>
              </svg>
            </UButton>
          </div>
        </div>
      </div>
    </header>
    <main class="body">
      <slot />
    </main>
    <aside class="info hidden xl:block">
      <AppResume />
    </aside>
  </div>
</template>

<style scoped>
/* .main {
  grid-template: "head head" "body info" minmax(0, 1fr) / 1fr 20rem;
}

.main-simple {
  grid-template: "head head" "body body" minmax(0, 1fr) / 1fr 20rem;
} */

.header {
  grid-row-start: head;
  grid-row-end: head;
  grid-column-start: head;
  grid-column-end: head;
}

.body {
  grid-area: body;
}

.info {
  grid-area: info;
}
</style>