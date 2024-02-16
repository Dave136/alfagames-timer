<script setup lang="ts">
import { Motion } from 'motion/vue';

interface Props {
  countdown: number;
}

interface Emits {
  (e: 'count', time: number): void;
  (e: 'raw', time: number): void;
  (e: 'new'): void;
  (e: 'formatted', time: string): void
  (e: 'finished'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isPaused = ref(false);
const isResetting = ref(false);
const offset = ref(1);
const rotation = ref(360);

const time = new Date();
time.setSeconds(time.getSeconds() + props.countdown)

const timer = useAppTimer(time as unknown as number);

function start() {
  timer.start();
  offset.value = (Math.max(timer.rawTime.value - 1, 0) / props.countdown)
  rotation.value = (Math.max(timer.rawTime.value - 1, 0) / props.countdown * 360)
  isPaused.value = false;
}

function pause() {
  timer.pause();
  offset.value = (timer.rawTime.value / props.countdown)
  rotation.value = (timer.rawTime.value / props.countdown * 360)
  isPaused.value = true;
}

function reset() {
  offset.value = 1
  rotation.value = 360
  isPaused.value = false;
  isResetting.value = true;
  timer.reset();
}

function resume() {
  timer.resume();
  isPaused.value = false;
}

function padValue(value: number, length = 2, char = '0') {
  const { length: currentLength } = value.toString();
  if (currentLength >= length) return value.toString();
  return `${char.repeat(length - currentLength)}${value}`;
}

watchEffect(() => {
  offset.value = Math.max(timer.rawTime.value - 1, 0) / props.countdown;
  rotation.value = (Math.max(timer.rawTime.value - 1, 0) / props.countdown) * 360;

  emit('raw', timer.rawTime.value)
})

watchEffect(() => {
  const formatted = `${padValue(timer.hours.value)}:${padValue(timer.minutes.value)}:${padValue(timer.seconds.value)}`;
  emit('formatted', formatted);
})

watchEffect(() => {
  if (timer.isExpired.value) {
    emit('finished')
  }
})


defineExpose({
  start,
  pause,
  resume,
  reset,
  paused: isPaused,
  resetting: isResetting
})
</script>

<template>
  <main>
    <svg viewBox="-50 -50 100 100" width="250" height="250" class="transition ease">
      <title>Remaining seconds: {{ timer.rawTime }}</title>
      <g fill="none" stroke="currentColor" stroke-width="1">
        <circle stroke="currentColor" r="46" />
        <Motion tag="path" stroke="hsl(310, 75%, 51%)" d="M 0 -46 a 46 46 0 0 0 0 92 46 46 0 0 0 0 -92" pathLength="1"
          stroke-dasharray="1" style="stroke: hsl(310, 75%, 51%);" :animate="{ strokeDashoffset: offset }" />
      </g>
      <g fill="hsl(310, 75%, 51%)" stroke="none">
        <!-- FIX: `deg` added -->
        <Motion tag="g" :animate="{ transform: `rotate(${rotation}deg)`, rotate: rotation }">
          <g transform="translate(0 -46)">
            <circle r="4" />
          </g>
        </Motion>
      </g>

      <g fill="currentColor" text-anchor="middle" dominant-baseline="baseline" font-size="16">
        <text x="-3" y="6.5">
          <template v-for="[key, value], i in Object.entries({ h: timer.hours, m: timer.minutes, s: timer.seconds })"
            :key="key">
            <template v-if="countdown >= 60 ** (2 - i)">
              <tspan dx="3" font-weight="bold">{{ padValue(value.value) }}</tspan>
              <tspan dx="0.5" font-size="8">{{ key }}</tspan>
            </template>
          </template>
        </text>
      </g>
    </svg>
  </main>
</template>

<style scoped>
/* main {
  padding: 0rem 1rem;
} */

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
