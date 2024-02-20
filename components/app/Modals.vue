<script setup lang="ts">
const appStore = useApp2Store();

const about = toRef(appStore.modals, 'about')
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
  </Teleport>
</template>