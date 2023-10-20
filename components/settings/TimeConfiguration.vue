<script setup lang="ts">
const appStore = useAppStore();

const label = ref('');
const mode = ref<'creation' | 'editing' | 'normal'>('normal');
const time = reactive({
  h: undefined,
  m: undefined,
  s: undefined,
});

const columns = [
  {
    key: 'id',
    label: 'id',
  },
  {
    key: 'label',
    label: 'Etiqueta',
  },
  {
    key: 'value',
    label: 'Tiempo',
  },
  {
    key: 'actions'
  }
];
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <header class="flex items-center justify-between">
          <h4 class="text-xl">Tiempo</h4>
          <UButton color="green" variant="soft" icon="i-ph-plus" @click="mode = 'creation'">Agregar</UButton>
        </header>
      </template>

      <section>
        <UTable :rows="appStore.times" :columns="columns">
          <template #actions-data="{ row }">
            <UButton color="green" variant="ghost" icon="i-ph-pencil-duotone" />
            <UButton color="red" variant="ghost" icon="i-ph-trash-duotone" />
          </template>
        </UTable>
      </section>

      <section class="mt-8" v-if="['creation', 'editing'].includes(mode)">
        <div class="flex flex-col gap-2">
          <UAlert title="Atención" color="orange" description="El tiempo mínimo son 15min" variant="soft"
            icon="i-ph-warning-duotone" />

          <div class="flex gap-2 mt-4">
            <UFormGroup>
              <UInput v-model="label" placeholder="Etiqueta" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>-</div>
            <UFormGroup>
              <UInput v-model="time.h" placeholder="hh" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>:</div>
            <UFormGroup required>
              <UInput v-model="time.m" placeholder="mm" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>:</div>
            <UFormGroup>
              <UInput v-model="time.s" placeholder="ss" :iu="{ base: 'w-10' }" />
            </UFormGroup>
          </div>
        </div>
      </section>

      <section class="mt-6 flex gap-2 justify-end" v-if="['creation', 'editing'].includes(mode)">
        <UButton color="cyan" variant="soft" icon="i-ph-floppy-disk">Guardar</UButton>
        <UButton color="red" variant="ghost" icon="i-ph-x" @click="mode = 'normal'">Cancelar</UButton>
      </section>
    </UCard>
  </div>
</template>