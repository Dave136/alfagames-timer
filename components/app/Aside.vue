<script setup lang="ts">
const links = [
  { name: 'Home', href: '/', icon: 'i-ph-cube' },
  { name: 'Settings', href: '/settings', icon: 'i-ph-gear-duotone' },
];
</script>

<template>
  <aside class="h-full p-4 flex flex-col justify-between border-r border-r-[#232c44]">
    <NuxtLink v-for="link in links" :key="link.name" :to="link.href">
      <UButton :icon="link.icon" size="xl" :color="$route.path === link.href ? 'pink' : 'gray'" variant="ghost" />
    </NuxtLink>
  </aside>
</template>