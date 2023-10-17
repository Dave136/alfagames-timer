<script setup lang="ts">
const appStore = useAppStore();
</script>

<template>
  <div class="bg-gray-900 p-6 min-h-screen">
    <div class="flex items-center justify-center h-full">
      <!-- <UIcon name="i-ph-x" class="text-6xl" /> -->
      <p class="text-gray-500" v-if="!appStore.consoleSelected?.id">Selecciona una consola</p>
      <pre v-else>
        {{ JSON.stringify(appStore.consoleSelected, null, 2) }}
      </pre>
    </div>
  </div>
</template>