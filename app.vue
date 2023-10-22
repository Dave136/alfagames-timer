<script setup lang="ts">
const notificationPosition = ref<NotificationPosition>('bottom-right');

provide('notificationPosition', notificationPosition);

const position = computed(() => {
  const values = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-0 right-0 mx-auto',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-0 right-0 mx-auto',
  };

  return values[notificationPosition.value] || values['bottom-right'];
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications :ui="{ position }" />
</template>

<style>
html {
  background-color: #0f172a;
  /* background-color: #0d0f14; */
}
</style>
