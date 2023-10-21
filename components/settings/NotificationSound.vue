<script setup lang="ts">
import { Motion } from 'motion/vue';
const soundsStore = useSoundsStore();

const cardRef = ref(null);
const isPlaying = ref(false);
const active = ref('');
const soundSelected = ref('');
const currentAudio = ref<HTMLAudioElement | null>(null);
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

function playSound(item: Sound) {
  let audio;
  try {
    isPlaying.value = true;
    active.value = item.id;

    if (currentAudio.value && currentAudio.value.getAttribute('id') === item.id) {
      audio = currentAudio.value;
    } else {
      if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
        currentAudio.value = null;
      }

      audio = new Audio(item.path);
      audio.setAttribute('id', item.id);
      currentAudio.value = audio;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
      isPlaying.value = false;
      active.value = '';
      currentAudio.value = null;
    }

    audio.onended = () => {
      isPlaying.value = false;
      active.value = '';
    }

  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  if (soundsStore.selected) {
    defaultSound.value = soundsStore.selected.id;
  }
});
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <header class="flex items-center justify-between">
          <h4 class="text-xl">Tono</h4>
          <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0.2 }" v-if="soundSelected">
            <UButton color="green" variant="soft" icon="i-ph-check" @click="setSound">Cambiar</UButton>
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
                @click.prevent="playSound(sound)" />
            </div>
          </button>
        </div>
      </section>
    </UCard>
  </div>
</template>