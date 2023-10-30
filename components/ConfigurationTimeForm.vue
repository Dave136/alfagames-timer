<script setup lang="ts">
import { object, string, number, maxValue, minValue, minLength, type Input } from 'valibot';

const form = ref(null);
const showGeneralAlert = ref(true);

const schema = computed(() => object({
  label: string([minLength(1, 'La etiqueta es requerida')]),
  h: number([maxValue(6, 'El tiempo máximo es de 6 horas'), minValue(0)]),
  m: number([maxValue(59, 'El tiempo mínimo es de 59 minutos'), minValue(state.value.h ? 0 : 20, state.value.h ? '' : 'El tiempo mínimo es de 20 minutos')]),
}));

type Schema = Input<typeof schema.value>;

const state = ref({
  label: '',
  h: 0,
  m: 0,
});

const emit = defineEmits<{
  (e: 'submit', data: Schema): void
}>();

defineExpose({
  form,
  state,
});

onMounted(() => {
  setTimeout(() => {
    showGeneralAlert.value = false
  }, 5000);
});
</script>

<template>
  <div class="flex flex-col gap-2 mt-8">
    <UAlert title="Atención" color="orange" description="El tiempo mínimo son 15min" variant="soft"
      icon="i-ph-warning-duotone" />

    <UForm ref="form" :schema="schema" :state="state" class="flex gap-2 mt-4">
      <UFormGroup name="label">
        <UInput v-model="state.label" placeholder="Etiqueta" :iu="{ base: 'w-10' }" />
      </UFormGroup>
      <div>-</div>
      <UFormGroup name="h">
        <UInput v-model.number="state.h" placeholder="hh" :iu="{ base: 'w-10' }" />
      </UFormGroup>
      <div>:</div>
      <UFormGroup name="m">
        <UInput v-model.number="state.m" placeholder="mm" :iu="{ base: 'w-10' }" />
      </UFormGroup>
    </UForm>
  </div>
</template>