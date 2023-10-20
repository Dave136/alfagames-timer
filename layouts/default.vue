<template>
  <div class="grid w-full min-h-screen"
    :class="`${$route.path === '/' ? 'grid-cols-[5rem_1fr_25rem]' : 'grid-cols-[5rem_1fr]'}`">
    <AppAside />
    <slot />
    <AppResume v-if="$route.path === '/'" />
  </div>
</template>