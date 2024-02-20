<script setup lang="ts">
import { invoke, window } from '@tauri-apps/api';

const appStore = useApp2Store();
const about = toRef(appStore.modals, 'about');

const items = [
  [{
    label: 'About',
    icon: 'i-ph-info',
    click: () => {
      about.value = true
    }
    // avatar: {
    //   src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    // }
  }], [{
    label: 'Toogle developer tools',
    // icon: 'i-heroicons-pencil-square-20-solid',
    icon: 'i-ph-wrench',
    shortcuts: ['E'],
    click: () => {
      invoke('toggle_devtools')
        .catch((error) => console.error("[ERROR] toggle_devtools", error))
    }
  }], [{
    label: 'Reload webview',
    // icon: 'i-heroicons-archive-box-20-solid'
    icon: 'i-ph-arrows-clockwise',
    click: () => {
      invoke('reload_app')
        .catch((error) => console.error("[ERROR] toggle_devtools", error))
    }
  }, {
    label: 'Minimize',
    // icon: 'i-heroicons-arrow-right-circle-20-solid'
    icon: 'i-ph-arrow-down',
    click: () => {
      window.appWindow.minimize()
    }
  }], [{
    label: 'Quit',
    // icon: 'i-heroicons-trash-20-solid',
    icon: 'i-ph-power',
    click: () => {
      window.appWindow.close()
    }
  }]
]
</script>

<template>
  <UDropdown :items="items" :ui="{
    item: { disabled: 'cursor-text select-text' }
  }" :popper="{ placement: 'bottom-start' }">
    <UButton class="pointer-events-auto" color="gray" variant="ghost">
      <img class="w-4" src="~/assets/img/logo.svg" alt="Alfagames Logo" />
    </UButton>

    <template #item="{ item }">
      <UButton class="pointer-events-auto hover:!bg-transparent" block color="gray" :padded="false" variant="ghost">
        <span class="truncate">{{ item.label }}</span>
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
      </UButton>
    </template>
  </UDropdown>
</template>

