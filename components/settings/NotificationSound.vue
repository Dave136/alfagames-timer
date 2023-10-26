<script setup lang="ts">
import { Motion } from 'motion/vue';
const soundsStore = useSoundsStore();

const { listen } = await import('@tauri-apps/api/event');

interface NSound extends Sound {
  downloaded: boolean;
}

const cardRef = ref(null);
const isPlaying = ref(false);
const active = ref('');
const soundSelected = ref('');
const sounds = computed(() => soundsStore.sounds);

const defaultSound = ref('');

onClickOutside(cardRef, (e) => {
  if (e.type === 'click') return;
  soundSelected.value = '';
  active.value = '';
});

function setSound() {
  soundsStore.selected = soundsStore.sounds.find((sound) => sound.id === soundSelected.value) as Sound;
  defaultSound.value = soundsStore.selected.id;
  soundSelected.value = '';
  active.value = '';

  useToast().add({
    icon: 'i-ph-check',
    title: 'Tono seleccionado',
    color: 'green'
  });
}

async function playSoundAction(sound: Sound) {
  if (isPlaying.value) return;

  try {
    isPlaying.value = true;
    active.value = sound.id
    await playSound(sound.path);
  } catch (error) {
    console.log(error);
    isPlaying.value = false;
  }
}

async function downloadNewSound(sound: NSound) {
  if (sound.downloaded) return;

  try {
    await downloadSound(sound.url, sound.path);
    soundsStore.refresh();
    useToast().add({
      icon: 'i-ph-check',
      color: 'green',
      title: 'Nuevo tono',
      description: `"${sound.name}" ha sido descargado`,
    });
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  soundsStore.load();
  if (soundsStore.selected) {
    defaultSound.value = soundsStore.selected.id;
  }
});

const unlisten = await listen('ended-sound', (event) => {
  isPlaying.value = !event.payload as boolean;
  active.value = '';
});

onUnmounted(() => {
  unlisten();
})
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <header class="flex items-center justify-between">
          <h4 class="text-xl">Tono</h4>
          <Motion class="flex gap-2" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0.2 }"
            v-if="soundSelected">
            <UButton color="green" variant="soft" icon="i-ph-check" @click="setSound">Cambiar</UButton>
            <UButton color="red" variant="ghost" icon="i-ph-x" @click="soundSelected = ''">Cancelar</UButton>
          </Motion>
        </header>
      </template>

      <section ref="cardRef">
        <div class="relative w-full">
          <button
            class="group relative flex items-center gap-2 focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-1 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75 border border-gray-700 my-2 first:mt-0 px-3 py-1.5 w-full focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 rounded-md font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50"
            :class="soundSelected === sound.id ? 'border-green-500' : defaultSound === sound.id ? 'border-pink-400' : 'border-gray-700'"
            v-for="sound in sounds" :key="sound.id">
            <UIcon name="i-ph-music-notes-duotone"
              class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"
              :class="soundSelected === sound.id ? 'dark:text-green-500 dark:group-hover:text-green-400' : defaultSound === sound.id ? 'dark:text-pink-400' : 'dark:text-gray-500'" />
            <button class="truncate relative text-gray-200 dark:text-white flex-1 text-left"
              :class="soundSelected === sound.id ? 'dark:text-green-500' : defaultSound === sound.id ? 'dark:text-pink-400' : 'dark:text-white'"
              @click="sound.id !== defaultSound && (soundSelected = sound.id)">
              {{ sound.name }}
            </button>
            <div class="flex-initial flex justify-end relative truncate">
              <UButton
                :color="soundSelected === sound.id ? 'green' : defaultSound === sound.id ? 'pink' : active === sound.id && isPlaying ? 'green' : 'gray'"
                variant="ghost"
                :icon="active === sound.id && isPlaying ? 'i-ph-stop-circle-duotone' : 'i-ph-play-circle-duotone'"
                :disabled="isPlaying" @click.prevent="playSoundAction(sound)" v-if="sound.downloaded" />
              <UButton color="gray" variant="link" icon="i-ph-download-simple-duotone" @click="downloadNewSound(sound)"
                v-else />
            </div>
          </button>
        </div>
      </section>
    </UCard>
  </div>
</template>