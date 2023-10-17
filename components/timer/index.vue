<script setup lang="ts">
import { Motion } from 'motion/vue';

interface Props {
  countdown: number;
}

interface Emits {
  (e: 'count', payload: { time: number }): void;
  (e: 'new'): void;
  (e: 'formatted', time: string): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const now = ref(Date.now());
const end = ref(now.value + props.countdown * 1000);

const count = computed(() => Math.round((end.value - now.value) / 1000));
const h = computed(() => Math.floor(count.value / 3600));
const m = computed(() => Math.floor((count.value - h.value * 3600) / 60));
const s = computed(() => count.value - h.value * 3600 - m.value * 60);

// $: count = Math.round((end - now) / 1000);
// $: h = Math.floor(count / 3600);
// $: m = Math.floor((count - h * 3600) / 60);
// $: s = count - h * 3600 - m * 60;

watchEffect(() => {
  if (count.value) {
    emit('count', {
      time: count.value,
    });
  }
})

// $: if (count) {
//   dispatch('count', {
//     time: count,
//   });
// }

function updateTimer() {
  // now = Date.now();
  now.value = Date.now();
}

const interval = ref(setInterval(updateTimer, 1000));

// const interval = computed({
//   get: () => setInterval(updateTimer, 1000),
//   set: (value: any) => setInterval(value, 1000),
// });

watchEffect(() => {
  if (count.value === 0) {
    clearInterval(interval.value);
  }
})

// $: if (count === 0) clearInterval(interval);

const isPaused = ref(false);
const isResetting = ref(false);

// let isPaused;
// let isResetting;
const duration = 1000;

// let offset = tweened(1, { duration, easing });
// let rotation = tweened(360, { duration, easing });

const offset = ref(1);
const rotation = ref(360);

const offsetRef = ref<HTMLOrSVGElement>();
const rotationRef = ref<HTMLOrSVGElement>();

watchEffect(() => {
  offset.value = Math.max(count.value - 1, 0) / props.countdown;
  rotation.value = (Math.max(count.value - 1, 0) / props.countdown) * 360;
})

// $: offset.set(Math.max(count - 1, 0) / countdown);
// $: rotation.set((Math.max(count - 1, 0) / countdown) * 360);

function handleNew() {
  clearInterval(interval.value);
  emit('new')
}

function handleStart() {
  now.value = Date.now();
  end.value = now.value + count.value * 1000;
  interval.value = setInterval(updateTimer, 1000);
  offset.value = (Math.max(count.value - 1, 0) / props.countdown);
  rotation.value = ((Math.max(count.value - 1, 0) / props.countdown) * 360);
  isPaused.value = false;
}

function handlePause() {
  offset.value = (count.value / props.countdown);
  rotation.value = ((count.value / props.countdown) * 360);
  clearInterval(interval.value);
  isPaused.value = true;
}

function handleReset() {
  clearInterval(interval.value);
  isResetting.value = true;
  isPaused.value = false;
  offset.value = 1;
  offset.value = 360;

  now.value = Date.now();
  end.value = now.value + props.countdown * 1000;
  interval.value = setInterval(updateTimer, 1000);
}

function padValue(value: number, length = 2, char = '0') {
  const { length: currentLength } = value.toString();
  if (currentLength >= length) return value.toString();
  return `${char.repeat(length - currentLength)}${value}`;
}

// $: dispatch('formatted', {
//   formatted: `${padValue(h)}:${padValue(m)}:${padValue(s)}`,
// });

watchEffect(() => {
  const formatted = `${padValue(h.value)}:${padValue(m.value)}:${padValue(s.value)}`;
  emit('formatted', formatted);
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <main>
    <!-- in:fly={{ y: -5 }} -->
    <svg viewBox="-50 -50 100 100" width="250" height="250" class="transition ease">
      <title>Remaining seconds: {{ count }}</title>
      <g fill="none" stroke="currentColor" stroke-width="1">
        <circle stroke="currentColor" r="46" />
        <!-- <path
        stroke="hsl(208, 100%, 50%)"
        d="M 0 -46 a 46 46 0 0 0 0 92 46 46 0 0 0 0 -92"
        pathLength="1"
        stroke-dasharray="1"
        stroke-dashoffset={$offset}
      /> -->
        <!-- <path stroke="hsl(310, 75%, 51%)" d="M 0 -46 a 46 46 0 0 0 0 92 46 46 0 0 0 0 -92" pathLength="1"
          stroke-dasharray="1" :stroke-dashoffset="offset" ref="offsetRef" /> -->
        <Motion tag="path" stroke="hsl(310, 75%, 51%)" d="M 0 -46 a 46 46 0 0 0 0 92 46 46 0 0 0 0 -92" pathLength="1"
          stroke-dasharray="1" style="stroke: hsl(310, 75%, 51%);" :animate="{ strokeDashoffset: offset }" />
      </g>
      <!-- <g fill="hsl(208, 100%, 50%)" stroke="none">
      <g transform="rotate({$rotation})">
        <g transform="translate(0 -46)">
          <circle r="4" />
        </g>
      </g>
    </g> -->
      <g fill="hsl(310, 75%, 51%)" stroke="none">
        <!-- <g :transform="`rotate(${rotation})`">
          <g transform="translate(0 -46)">
            <circle r="4" />
          </g>
        </g> -->
        <Motion tag="g" :animate="{ transform: `rotate(${rotation})`, rotate: rotation }">
          <g transform="translate(0 -46)">
            <circle r="4" />
          </g>
        </Motion>
      </g>

      <g fill="currentColor" text-anchor="middle" dominant-baseline="baseline" font-size="4">
        <text x="-3" y="6.5">
          <template v-for="[key, value], i in Object.entries({ h, m, s })" :key="key">
            <template v-if="countdown >= 60 ** (2 - i)">
              <tspan dx="3" font-weight="bold">{{ padValue(value) }}</tspan>
              <tspan dx="0.5" font-size="3">{{ key }}</tspan>
            </template>
          </template>
          <!-- {#each Object.entries({ h, m, s }) as [key, value], i}
          {#if countdown >= 60 ** (2 - i)}
          <tspan dx="3" font-weight="bold">{padValue(value)}</tspan>
          <tspan dx="0.5" font-size="3">{key}</tspan>
          {/if}
          {/each} -->
        </text>
      </g>
    </svg>

    <!-- in:fly={{ y: -10, delay: 120 }} -->
    <div class="flex justify-center">
      <button @click="handleNew" class="hidden">Nuevo tiempo</button>
      <div class="w-full">
        <slot name="actions" />
        <!-- <slot name="actions" store={{ isPaused, isResetting, handleStart, handlePause, disabled: isResetting || count===0,
          }} /> -->
      </div>

      <button :disabled="isResetting || count === 0" @click="handleStart" class="hidden" v-if="isPaused">
        <span class="visually-hidden">Iniciar</span>

        <svg viewBox="-50 -50 100 100" width="30" height="30">
          <g fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
            <path d="M -25 -40 l 60 40 -60 40z" />
          </g>
        </svg>
      </button>
      <button :disabled="isResetting || count === 0" @click="handlePause" class="hidden" v-else>
        <span class="visually-hidden">Pausar</span>
        <svg viewBox="-50 -50 100 100" width="30" height="30">
          <g fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
            <path d="M -25 -30 v 60 m 50 0 v -60" />
          </g>
        </svg>
      </button>

      <button @click="handleReset" class="hidden">Resetear</button>
    </div>
  </main>
</template>

<style>
main {
  padding: 0rem 1rem;
}

main>svg {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 0;
}

div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 
  @supports (display: grid) {
    div {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      justify-content: initial;
      justify-items: center;
    }
  } */

button:nth-of-type(odd) {
  width: max-content;
  font-size: 0.9rem;
  color: inherit;
  border: none;
  background: none;
  text-transform: capitalize;
}

button:nth-of-type(odd):hover {
  text-decoration: underline;
}

button:nth-of-type(2) {
  color: inherit;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  padding: 1rem;
  /* background: hsl(208, 100%, 50%); */
  background: hsl(310, 75%, 51%);
  /* box-shadow: 0px 1px 2px hsl(208, 100%, 50%); */
  box-shadow: 0px 1px 2px hsl(310, 75%, 51%);
  transition: box-shadow 0.2s ease-in-out, transform 0.25s ease-in-out;
}

button:nth-of-type(2):hover,
button:nth-of-type(2):focus {
  /* box-shadow: 0px 1px 5px hsl(208, 100%, 50%); */
  box-shadow: 0px 1px 5px hsl(310, 75%, 51%);
}

button:nth-of-type(2) svg {
  margin: initial;
  width: 100%;
  height: auto;
  display: block;
}

button[disabled] {
  transform: scale(0);
}
</style>
