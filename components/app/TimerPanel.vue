<script setup lang="ts">
import { ConsoleNintendo, ConsolePlayStation, ConsoleXbox } from '#components';


const active = ref('');
const target = ref(null);
const appStore = useAppStore();

const timeModal = ref(false);
const selectedTime = ref('');
const isCustomTime = ref(false);

const custom = ref({
  h: 0,
  m: 0,
  s: 0,
});

// onClickOutside(target, () => {
//   active.value = '';
//   appStore.consoleSelected = {};
// });

const times: Record<string, number> = {
  '20m': 20 * 60,
  '30m': 30 * 60,
  '1h': 60 * 60,
  '2h': 2 * 60 * 60,
  '3h': 3 * 60 * 60,
}

const elements = [
  {
    id: 'nintendo',
    component: ConsoleNintendo,
  },
  {
    id: 'ps5',
    component: ConsolePlayStation,
  },
  {
    id: 'xbox',
    component: ConsoleXbox,
  }
];

function select(id: string) {
  active.value = id;
}

function openTimeModal() {
  timeModal.value = true;
}

function setConsoleTime() {
  console.log({
    time: selectedTime.value,
    isCustomTime: isCustomTime.value,
    custom: custom.value,
    countdown: isCustomTime.value ? custom.value : times[selectedTime.value],
  });
  appStore.consoleSelected = {
    id: active.value,
    name: 'The console',
    countdown: isCustomTime.value ? custom.value : times[selectedTime.value],
  }
  timeModal.value = false;
}
</script>

<template>
  <section class="flex items-center gap-8 justify-center mt-56" ref="target">
    <div class="flex flex-col items-center" v-for="element in elements" :key="element.id">
      <button @click="select(element.id)">
        <UCard :ui="{ base: `border ${active === element.id ? 'border-pink-500' : 'border-transparent'}` }">
          <div class="flex flex-col items-center w-[198px] h-[198px]"
            v-if="element.id === appStore.consoleSelected.id && appStore.consoleSelected.countdown > 0">
            <Timer :countdown="1 * 60" />
          </div>
          <div class="flex flex-col items-center" v-else>
            <component :is="element.component" v-bind="{ class: 'fill-pink-500 w-[150px]' }" />
          </div>
        </UCard>
      </button>
      <div>
        <UButton class="mt-6" icon="i-ph-clock" variant="ghost" @click="openTimeModal"
          :disabled="active !== element.id" />
      </div>
    </div>
    <UModal v-model="timeModal">
      <section class="p-6">
        <h1 class="text-2xl mb-2">Selecciona el tiempo</h1>
        <USelectMenu v-model="selectedTime" :options="Object.keys(times)" :disabled="isCustomTime" />

        <UCheckbox v-model="isCustomTime" class="my-4" name="Tiempo personalizado" label="Tiempo personalizado" />

        <div v-if="isCustomTime" class="flex gap-2">
          <UInput v-model="custom.h" placeholder="hh" :iu="{ base: 'w-10' }" />
          :
          <UInput v-model="custom.m" placeholder="mm" :iu="{ base: 'w-10' }" />
          :
          <UInput v-model="custom.s" placeholder="ss" :iu="{ base: 'w-10' }" />
        </div>

        <UButton @click="setConsoleTime" class="mt-6">Iniciar</UButton>
      </section>
    </UModal>

    <!-- <pre>
      {{ JSON.stringify({ selectedTime, isCustomTime, custom, conditional: active === appStore.consoleSelected.id && appStore.consoleSelected.countdown > 0 }, null, 2) }}
    </pre> -->
  </section>
</template>
