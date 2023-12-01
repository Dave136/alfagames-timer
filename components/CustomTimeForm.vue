<script setup lang="ts">
import { object, number, maxValue, minValue, type Input } from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';

const showGeneralAlert = ref(true);

const schema = computed(() => {
  return object({
    h: number([maxValue(6, 'El tiempo máximo es de 6 horas'), minValue(0)]),
    m: number([maxValue(59, 'El tiempo mínimo es de 59 minutos'), minValue(state.value.h ? 0 : 1, state.value.h ? '' : 'El tiempo mínimo es de 1 minuto')]),
  })
})

type Schema = Input<typeof schema.value>;

const state = ref({
  h: 0,
  m: 0,
});

const emit = defineEmits<{
  (e: 'submit', data: Schema): void
}>();

async function submit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data);
}

onMounted(() => {
  setTimeout(() => {
    showGeneralAlert.value = false
  }, 5000);
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <UAlert title="Atención" color="orange" description="Si no tiene establecida una hora, debe ingresar los minutos"
      variant="soft" icon="i-ph-warning-duotone" v-if="!state.h" />

    <UForm :schema="schema" :state="state" class="mt-4" @submit="submit">
      <div class="flex gap-2">
        <UFormGroup label="Horas" name="h">
          <UInput v-model.number="state.h" placeholder="hh" :iu="{ base: 'w-10' }" />
        </UFormGroup>
        <div class="pt-6">:</div>
        <UFormGroup label="Minutos" required name="m">
          <UInput v-model.number="state.m" placeholder="mm" :iu="{ base: 'w-10' }" />
        </UFormGroup>
      </div>

      <UButton type="submit" class="mt-6">Iniciar</UButton>
    </UForm>
  </div>
</template>