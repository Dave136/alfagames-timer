<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Presence, Motion } from 'motion/vue';
import { DEFAULT_VALUES } from '~/stores/consoles';

dayjs.extend(duration);

const active = ref('');
const stopId = ref('');
const target = ref(null);
const consolesStore = useConsolesStore();
const appStore = useAppStore();
const soundsStore = useSoundsStore();

const timeModal = ref(false);
const stopModal = ref(false);

const selectedTime = ref<Time>();
const isCustomTime = ref(false);
const isTransfer = ref(false);
const currentActive = ref('');
const playing = ref(false);
const timers = ref<Record<any, any>>({});

const activeConsoles = computed(() => consolesStore.consoles.filter(c => c.countdown));
const freeConsoles = computed(() => consolesStore.consoles.filter(c => !c.countdown && !c.finished && !c.currentTime));

onClickOutside(target, () => {
  if (timeModal.value) return;
  active.value = '';
  consolesStore.selected = null;
});

const times: Record<string, number> = {
  '30s': 30,
  '1m': 1 * 60,
  '20m': 20 * 60,
  '1h': 60 * 60,
}

function openTimeModal() {
  timeModal.value = true;
}

function getCustomTime(data: CustomTimeData) {
  const { h = 0, m = 0 } = data;
  const hours = h * 60 * 60
  const min = m * 60

  return hours + min;
}

function setConsoleTime(data?: CustomTimeData) {
  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if (c.id === active.value) {
      const now = new Date().toString();
      const time = isCustomTime.value ? getCustomTime(data as CustomTimeData) : selectedTime.value!.raw;

      return {
        ...c,
        finished: false,
        countdown: time,
        futureTime: dayjs(now).add(time, 's').toString(),
      }
    }

    return c;
  })
  timeModal.value = false;
  active.value = '';
  consolesStore.selected = null;
}

function extendTime(id: string) {
  active.value = id;
  openTimeModal();
}

function recalculateFutureTime(id: string) {
  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if (c.id === id) {
      const now = new Date().toString();
      const time = c.currentTime as number;

      return {
        ...c,
        futureTime: dayjs(now).add(time, 's').toString(),
      }
    }

    return c;
  });
}

function activeTransferMode(id: string) {
  if (!freeConsoles.value.length) {
    useToast().add({
      color: 'red',
      icon: 'i-ph-warning-duotone',
      title: 'No hay consolas disponibles',
    });
    return;
  }

  isTransfer.value = true;
  currentActive.value = id;
  active.value = '';
}

function transferTime() {
  consolesStore.transferTime(currentActive.value, active.value);
  isTransfer.value = false;
  currentActive.value = '';
}


function stop() {
  consolesStore.stop(stopId.value)
  timers.value[stopId.value].new();
  stopModal.value = false;
  stopId.value = '';
}


function togglePause(id: string) {
  if (timers.value[id].paused) {
    // recalculateFutureTime(id);
    timers.value[id].resume();
    return;
  }

  timers.value[id].pause()
}

function finishTime(item: Consoles) {
  if (item.finished || playing.value) return;

  isTransfer.value = false;

  const updated = {
    ...item,
    currentTime: 0,
    countdown: 0,
    finished: true,
  }

  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if (c.id === updated.id) {
      return updated;
    }

    return c;
  });

  playSound(soundsStore.selected?.path)

}

onBeforeMount(() => {
  if (!activeConsoles.value.length) return;

  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if ((c.countdown && c.countdown < 0) || (c.currentTime && c.currentTime < 0)) {
      return {
        ...c,
        ...DEFAULT_VALUES,
      }
    }

    if (c.countdown && c.currentTime && !c.finished) {
      const now = dayjs();
      const future = dayjs(c.futureTime);
      const isGreaterThenFuture = now.isAfter(future);
      const diff = future.diff(now);
      const duration = dayjs.duration(diff);
      const seconds = Math.floor(duration.asSeconds());

      if (isGreaterThenFuture) {
        c.finished = true;
        isTransfer.value = false;
      }

      c.currentTime = isGreaterThenFuture ? 0 : seconds;
      c.countdown = isGreaterThenFuture ? 0 : seconds;

      return {
        ...c,
      }
    }

    return c;
  })
})
</script>

<template>
  <section
    class="grid grid-cols-3 items-center gap-4 justify-center overflow-hidden lg:gap-8 lg:grid-cols-4 xl:grid-cols-5"
    ref="target">
    <div class="flex flex-col items-center" v-for="item in consolesStore.consoles" :key="item.id">
      <button @click="(active = item.id) && (consolesStore.selected = item)"
        :disabled="isTransfer && item.countdown > 0 || item.finished">
        <UCard
          :ui="{ base: `border relative ${active === item.id ? isTransfer ? 'border-green-400' : 'border-pink-500' : 'border-transparent'}` }">
          <div class="flex flex-col items-center w-[7.5rem] h-[7.5rem]" v-if="item.countdown > 0">
            <!-- <Timer :countdown="item.countdown" @count="(time) => item.currentTime = time"
              @formatted="(time) => item.formatted = time" :ref="(el) => el && (timers[item.id] = el)"
              @finished="finishTime(item)" /> -->
            <!-- <TimerNew :countdown="item.countdown" :ref="(el) => el && (timers[item.id] = el)"
              @count="(time) => item.currentTime = time" @formatted="(time) => item.formatted = time"
              @finished="finishTime(item)" /> -->

            <TimerNew :countdown="item.countdown" @raw="(time) => item.currentTime = time"
              :ref="(el) => el && (timers[item.id] = el)" @formatted="(time) => item.formatted = time"
              @finished="finishTime(item)" />
          </div>
          <div class="flex flex-col items-center" v-else>
            <component :is="getIcon(item.icon)"
              v-bind="{ class: `${isTransfer && active === item.id ? 'fill-green-400' : !isTransfer && active === item.id ? 'fill-pink-500' : 'fill-gray-500'} w-[7.5rem]` }" />
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
        <UBadge v-if="isTransfer && currentActive === item.id" variant="soft">Transfiriendo</UBadge>
        <UBadge color="green" class="animate-pulse" variant="soft"
          v-if="isTransfer && active !== item.id && !item.countdown && !item.finished">
          Disponible</UBadge>
        <UButton icon="i-ph-check-circle" size="xl" color="green" variant="ghost" @click="transferTime"
          title="Seleccionar" v-if="isTransfer && active === item.id" />

        <!-- Normal -->
        <UButton icon="i-ph-stop-circle-duotone" size="xl" :color="active === item.id ? 'pink' : 'gray'" variant="ghost"
          @click="() => {
            stopModal = true
            stopId = item.id
          }" v-if="!isTransfer && !item.finished && item.currentTime && item.countdown" />
        <UButton
          :icon="timers[item.id] && timers[item.id].paused ? 'i-ph-play-circle-duotone' : 'i-ph-pause-circle-duotone'"
          size="xl" :color="active === item.id ? 'pink' : 'gray'" variant="ghost" @click="togglePause(item.id)"
          v-if="!isTransfer && !item.finished && item.currentTime && item.countdown" />
        <UButton icon="i-ph-clock-countdown" size="xl" :color="active === item.id ? 'pink' : 'gray'" variant="ghost"
          @click="openTimeModal" :disabled="active !== item.id"
          v-if="!item.finished && !isTransfer && !item.countdown && !item.currentTime" />
        <UButton icon="i-ph-arrows-left-right" size="xl" :color="active === item.id ? 'pink' : 'gray'" variant="ghost"
          @click="activeTransferMode(item.id)"
          v-if="!isTransfer && !item.finished && item.currentTime && item.currentTime > 0" title="Transferir" />
        <UButton icon="i-ph-check-circle" class="animate-pulse" size="xl" color="green" variant="ghost"
          @click="consolesStore.resetData(item.id)" title="Finalizar" v-if="item.finished" />
        <UButton icon="i-ph-plus-circle-duotone" size="xl" variant="ghost" @click="extendTime(item.id)"
          v-if="item.finished" />
      </div>
    </div>
    <UModal v-model="timeModal">
      <section class="p-8">
        <h1 class="text-lg mb-8">Selecciona el tiempo</h1>
        <USelectMenu v-model="selectedTime" :options="appStore.times" :disabled="isCustomTime" />
        <UCheckbox v-model="isCustomTime" class="my-8" name="Personalizar" label="Personalizar" />
        <CustomTimeForm v-if="isCustomTime" @submit="(data) => setConsoleTime(data)" />
        <UButton @click="setConsoleTime" class="mt-6" v-if="!isCustomTime">
          Iniciar
        </UButton>
      </section>
    </UModal>

    <UModal v-model="stopModal" prevent-close>
      <section class="p-8">
        <h3 class="text-lg mb-6">¿Estás seguro de finalizar el tiempo?</h3>
        <div class="flex gap-2">
          <UButton variant="ghost" label="Cancelar" @click="() => {
            stopModal = false
            stopId = ''
          }" />
          <UButton label="Finalizar" @click="stop" />
        </div>
      </section>
    </UModal>

    <Presence>
      <Motion class="absolute left-0 right-0 mx-auto bottom-0" v-if="isTransfer"
        :initial="{ position: 'absolute', opacity: 0, y: 100 }" :animate="{ opacity: 1, y: 0 }" :exit="{ y: 100 }">
        <div
          class="absolute text-left overflow-hidden w-full !max-w-sm bg-white dark:bg-gray-900 sm:max-w-lg rounded-lg sm:my-8 shadow-xl mx-auto left-0 right-0 bottom-0">
          <section class="p-4 flex items-center">
            <UIcon name="i-ph-arrows-left-right" class="text-pink-400 text-xl" />
            <span class="mx-4 flex-1">Transfiriendo...</span>
            <UButton icon="i-ph-x-circle-duotone" color="red" variant="soft" label="Cancelar"
              @click="(isTransfer = false) && (currentActive = '')" />
          </section>
        </div>
      </Motion>
    </Presence>
  </section>
</template>
