<script setup lang="ts">
const app2 = useApp2Store();

onMounted(async () => {
  await app2.initialize();
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<style>
html {
  background-color: #0f172a;
  /* background-color: #0d0f14; */
}
</style>
