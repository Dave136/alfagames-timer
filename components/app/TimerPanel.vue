<script setup lang="ts">
import { ConsoleNintendo, ConsolePlayStation, ConsoleXbox } from '#components';


const active = ref('');
const target = ref(null);
const appStore = useAppStore();

onClickOutside(target, () => {
  active.value = '';
  appStore.consoleSelected = {};
});

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

  appStore.consoleSelected = {
    id,
    name: 'The console',
    nickname: 'TConsole',
  }
}
</script>

<template>
  <section class="flex items-center gap-8 justify-center mt-56" ref="target">
    <button v-for="element in elements" :key="element.id" @click="select(element.id)">
      <UCard :ui="{ base: `border ${active === element.id ? 'border-pink-500' : 'border-transparent'}` }">
        <div class="flex flex-col items-center">
          <component :is="element.component" v-bind="{ class: 'fill-pink-500 w-[150px]' }" />
          <UButton class="mt-6" icon="i-ph-clock" variant="ghost" />
        </div>
      </UCard>
    </button>
  </section>
</template>
