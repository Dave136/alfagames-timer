<script setup lang="ts">
const links = [
  { name: 'Home', href: '/', icon: 'i-ph-house-duotone' },
  { name: 'Settings', href: '/settings', icon: 'i-ph-gear-duotone' },
];
</script>

<template>
  <aside class="h-full p-4 flex flex-col gap-8 border-r border-r-[#232c44]">
    <NuxtLink class="flex items-center mx-auto" to="/">
      <img class="w-8" src="~/assets/img/logo.svg" alt="Alfagames Logo" />
    </NuxtLink>

    <div class="h-full flex flex-col justify-between">
      <NuxtLink v-for="link in links" :key="link.name" :to="link.href">
        <UButton :icon="link.icon" size="xl" :color="$route.path === link.href ? 'pink' : 'gray'" variant="ghost" />
      </NuxtLink>
    </div>
  </aside>
</template>