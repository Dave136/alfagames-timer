<script setup lang="ts">
import dayjs from 'dayjs';
const consoleStore = useConsolesStore();

const finalTime = computed(() => consoleStore.selected?.futureTime ? dayjs(consoleStore.selected?.futureTime).format('hh:mm a') : '');
const showInfo = computed(() => consoleStore.selected?.countdown || consoleStore.selected?.currentTime);
</script>

<template>
  <div class="bg-gray-900 p-6 min-h-screen">
    <div class="flex flex-col items-start h-full" :class="!consoleStore.selected?.id && 'justify-center'">
      <header class="flex items-center flex-row-reverse gap-3">
        <h3 class="text-xl font-bold">{{ consoleStore.selected?.name }}</h3>
        <component :is="getLogo(consoleStore.selected?.icon)" v-bind="{ class: 'fill-white/40 w-8' }"
          v-if="consoleStore.selected?.icon" />
      </header>
      <div class="w-full flex flex-col mt-6">
        <p class="text-gray-500 text-center" v-if="!consoleStore.selected?.id">Selecciona una consola</p>

        <div v-else>
          <div v-if="showInfo">
            <p class="text-lg mb-2"><span class="text-gray-500 font-bold mr-4">Hora de
                finalización:</span> {{ finalTime }}</p>
            <p class="text-lg"><span class="text-gray-500 font-bold mr-4">Tiempo:</span> {{
              consoleStore.selected?.formatted }}</p>
          </div>
          <div class="animate-pulse" v-else>
            <p class="text-center text-gray-600">Establezca el tiempo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>