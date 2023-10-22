<script setup lang="ts">
import dayjs from 'dayjs';
import { Presence, Motion } from 'motion/vue';

const SECONDS = 1000;
const MINIMAL_MIN_TIME = 15;

const active = ref('');
const target = ref(null);
const consolesStore = useConsolesStore();
const appStore = useAppStore();
const soundsStore = useSoundsStore();

const timeModal = ref(false);
const selectedTime = ref<Time>();
const isCustomTime = ref(false);
const isTransfer = ref(false);
const currentActive = ref('');

const timers = ref<Record<any, any>>({});

const custom = ref({
  h: undefined,
  m: undefined,
  s: undefined,
});

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

function getCustomTime() {
  const { h = 0, m = 0, s = 0 } = custom.value;
  const hours = h * 60 * 60
  const min = m * 60
  const sec = s;

  return hours + min + sec;
}

function setConsoleTime() {
  consolesStore.consoles = consolesStore.consoles.map((c) => {
    if (c.id === active.value) {
      const now = new Date().toString();
      const time = isCustomTime.value ? getCustomTime() : selectedTime.value!.raw;

      return {
        ...c,
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

function togglePause(id: string) {
  if (timers.value[id].isPaused) {
    recalculateFutureTime(id);
    timers.value[id].handleStart();
    return;
  }

  timers.value[id].handlePause()
  console.log(timers.value[id])
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
      isTransfer.value = false;
      playSound(soundsStore.selected?.path);
    }

    item.currentTime = isGreaterThenFuture ? 0 : seconds;
    item.countdown = isGreaterThenFuture ? 0 : item.countdown;
    // item.countdown = isGreaterThenFuture ? 0 : item.countdown;
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
    });
  });
}, { deep: true });
</script>

<template>
  <section class="flex items-center gap-8 justify-center overflow-hidden" ref="target">
    <div class="flex flex-col items-center" v-for="item in consolesStore.consoles" :key="item.id">
      <button @click="(active = item.id) && (consolesStore.selected = item)"
        :disabled="isTransfer && item.countdown > 0 || item.finished">
        <UCard
          :ui="{ base: `border relative ${active === item.id ? isTransfer ? 'border-green-400' : 'border-pink-500' : 'border-transparent'}` }">
          <div class="flex flex-col items-center w-[150px] h-[150px]" v-if="item.countdown > 0">
            <Timer :countdown="item.countdown" @count="(time) => item.currentTime = time"
              @formatted="(time) => item.formatted = time" :ref="(el) => el && (timers[item.id] = el)" />
          </div>
          <div class="flex flex-col items-center" v-else>
            <component :is="getIcon(item.icon)"
              v-bind="{ class: `${isTransfer && active === item.id ? 'fill-green-400' : !isTransfer && active === item.id ? 'fill-pink-500' : 'fill-gray-500'} w-[150px]` }" />
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
        <UButton
          :icon="timers[item.id] && timers[item.id].isPaused ? 'i-ph-play-circle-duotone' : 'i-ph-pause-circle-duotone'"
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
        <UButton icon="i-ph-plus-circle-duotone" size="xl" variant="ghost" @click="openTimeModal" v-if="item.finished" />
      </div>
    </div>
    <UModal v-model="timeModal">
      <section class="p-8">
        <h1 class="text-2xl mb-8">Selecciona el tiempo</h1>
        <USelectMenu v-model="selectedTime" :options="appStore.times" :disabled="isCustomTime" />

        <UCheckbox v-model="isCustomTime" class="my-8" name="Personalizar" label="Personalizar" />

        <div v-if="isCustomTime" class="flex flex-col gap-2">
          <UAlert title="Atención" color="orange" description="El tiempo mínimo son 15min" variant="soft"
            icon="i-ph-warning-duotone" />

          <div class="flex gap-2 mt-4">
            <UFormGroup>
              <UInput v-model="custom.h" placeholder="hh" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>:</div>
            <UFormGroup required>
              <UInput v-model="custom.m" placeholder="mm" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>:</div>
            <UFormGroup>
              <UInput v-model="custom.s" placeholder="ss" :iu="{ base: 'w-10' }" />
            </UFormGroup>
          </div>
        </div>

        <UButton @click="setConsoleTime" class="mt-6"
          :disabled="isCustomTime && !custom.h && (!custom.m || custom.m < MINIMAL_MIN_TIME)">
          Iniciar</UButton>
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
