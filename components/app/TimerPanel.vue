<script setup lang="ts">
import dayjs from 'dayjs';

const SECONDS = 1000;

const active = ref('');
const target = ref(null);
const consolesStore = useConsolesStore();

const timeModal = ref(false);
const selectedTime = ref('');
const isCustomTime = ref(false);

const custom = ref({
  h: 0,
  m: 0,
  s: 0,
});

const activeConsoles = computed(() => consolesStore.consoles.filter(c => c.countdown));

// onClickOutside(target, () => {
//   active.value = '';
//   appStore.consoleSelected = {};
// });

// const times: Record<string, number> = {
//   '20m': 20 * 60,
//   '30m': 30 * 60,
//   '1h': 60 * 60,
//   '2h': 2 * 60 * 60,
//   '3h': 3 * 60 * 60,
// }

const times: Record<string, number> = {
  '30s': 30,
  '1m': 1 * 60,
}

function openTimeModal() {
  timeModal.value = true;
}

function setConsoleTime() {
  // consolesStore.consoles.find(c => c.id === active.value)!.countdown = isCustomTime.value ? 60 : times[selectedTime.value];
  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if (c.id === active.value) {
      const now = new Date().toString();

      return {
        ...c,
        countdown: isCustomTime.value ? 60 : times[selectedTime.value],
        futureTime: dayjs(now).add(times[selectedTime.value], 's').toString(),
      }
    }

    return c;
  })
  timeModal.value = false;
}

watch(activeConsoles, (consoles) => {
  const updated = consoles.map((item) => {
    const now = new Date();
    const futureTime = new Date(item.futureTime as string);
    // if current time is greater than setted time
    const isGreaterThenFuture = now.getTime() > futureTime.getTime();
    const seconds = Math.floor(
      (futureTime.getTime() - now.getTime()) / SECONDS
    );

    if (isGreaterThenFuture) {
      item.finished = true;
    }

    item.currentTime = isGreaterThenFuture ? 0 : seconds;
    item.countdown = isGreaterThenFuture ? 0 : item.countdown;
  });

  updated.forEach((item: any) => {
    consolesStore.consoles = consolesStore.consoles.map((c) => {
      if (c.id === item?.id) {
        return {
          ...c,
          ...item,
        };
      }

      return c;
    })
  })
}, { deep: true });
</script>

<template>
  <section class="flex items-center gap-8 justify-center" ref="target">
    <div class="flex flex-col items-center" v-for="item in consolesStore.consoles" :key="item.id">
      <button @click="active = item.id">
        <UCard :ui="{ base: `border relative ${active === item.id ? 'border-pink-500' : 'border-transparent'}` }">
          <div class="flex flex-col items-center w-[198px] h-[198px]" v-if="item.countdown > 0">
            <Timer :countdown="item.countdown" @count="(time) => item.currentTime = time" />
          </div>
          <div class="flex flex-col items-center" v-else>
            <component :is="getIcon(item.icon)" v-bind="{ class: 'fill-pink-500 w-[150px]' }" />
          </div>
          <div
            class="absolute w-full h-full left-0 top-0 flex justify-center items-center bg-black/20 rounded-md backdrop-blur-sm"
            v-if="item.finished">
            <h3 class="text-center mb-4 animate-pulse text-2xl font-bold text-white/60">
              Finalizado
            </h3>
          </div>
        </UCard>
      </button>
      <div class="mt-6">
        <UButton icon="i-ph-clock-countdown" size="xl" variant="ghost" @click="openTimeModal"
          :disabled="active !== item.id" v-if="!item.finished" />
        <UButton icon="i-ph-check-circle" class="animate-pulse" size="xl" color="green" variant="ghost"
          @click="consolesStore.resetData(item.id)" title="Finalizar" v-if="item.finished" />
        <UButton icon="i-ph-plus-circle-duotone" size="xl" variant="ghost" @click="openTimeModal" v-if="item.finished" />
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
  </section>
</template>
