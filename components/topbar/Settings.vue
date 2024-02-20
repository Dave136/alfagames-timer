<script setup lang="ts">
const appStore = useApp2Store();
const settings = toRef(appStore.modals, 'settings');

const items = [
  [{
    label: 'Settings',
    icon: 'i-ph-gear',
    click: () => {
      settings.value = true
    }
  }], [{
    label: 'Keyboard shortcuts',
    // icon: 'i-heroicons-pencil-square-20-solid',
    icon: 'i-ph-keyboard',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }]
]
</script>

<template>
  <UDropdown :items="items" :ui="{
    background: 'dark:bg-[#1e2227]',
    item: { disabled: 'cursor-text select-text' }
  }" :popper="{ placement: 'bottom-start' }">
    <UButton class="pointer-events-auto" color="gray" variant="ghost">
      <UIcon name="i-ph-gear" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </UButton>

    <template #item="{ item }">
      <UButton class="pointer-events-auto hover:!bg-transparent" block color="gray" :padded="false" variant="ghost">
        <UIcon :name="item.icon" class="h-4 w-4 text-gray-400 dark:text-gray-500" />

        <span class="truncate">{{ item.label }}</span>

        <pre class="hidden md:inline-flex flex-shrink-0 gap-0.5 ms-auto ">
          <span v-if="item.shortcuts" class="text-gray-400 dark:text-gray-500 ">{{ item.shortcuts.join('/') }}</span>
        </pre>
      </UButton>
    </template>
  </UDropdown>
</template>

