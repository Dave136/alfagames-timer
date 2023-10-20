<script setup lang="ts">

onMounted(() => {
  const audio = new Audio('/sounds/mario-lost-life.mp3');
  console.log(audio.play());
})
</script>

<template>
  <section>
    <MainPanel />
  </section>
</template>