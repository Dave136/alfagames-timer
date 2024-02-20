<script setup lang="ts">
const appStore = useApp2Store();

const about = toRef(appStore.modals, 'about')
const settings = toRef(appStore.modals, 'settings')
</script>

<template>
  <Teleport to="body">
    <UModal :ui="{
      width: '!max-w-sm',
      overlay: { background: 'backdrop-blur-1' }
    }" v-model="about">
      <div class="p-6">
        <p><b>Autor:</b> David Arenas</p>
        <p><b>Licencia:</b> MIT</p>
        <p><b>Version:</b> 0.1.7</p>
        <p><b>Website:</b> <a href="https://github.com/Dave136/alfagames-timer" target="_blank"
            class="underline">alfagames timer</a></p>
      </div>
    </UModal>
    <UModal v-model="settings" :ui="{ width: '!w-[60vw] lg:max-w-full', height: '!h-[80vh]' }">
      <section class="max-h-12 p-6">
        <header class="flex justify-between">
          <h3 class="text-xl">Configuración</h3>
          <UButton color="white" variant="ghost" @click="settings = false" icon="i-ph-x"></UButton>
        </header>
        <hr class="my-4 border-gray-700">

        <div class="grid grid-cols-2 mt-8 gap-8 mr-20">
          <SettingsTimeConfiguration />
          <SettingsNotificationSound />
        </div>
      </section>
    </UModal>
  </Teleport>
</template>