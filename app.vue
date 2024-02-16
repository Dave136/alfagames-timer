<script setup lang="ts">
const app2 = useApp2Store();

onMounted(async () => {
  await app2.initialize();
})
</script>

<template>
  <div class="w-full min-h-full overflow-hidden">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<style>
html {
  background-color: #0f172a;
}

body {
  height: 100%;
  width: 100%;
}
</style>
