<script setup lang="ts">
const appStore = useAppStore();

const label = ref('');
const mode = ref<'creation' | 'editing' | 'normal'>('normal');
const time = reactive<Record<string, number | undefined>>({
  h: undefined,
  m: undefined,
  // s: undefined,
});

const itemId = ref('');
const isDelete = ref(false);

const hh = computed<number>(() => time?.h || 0);
const mm = computed<number>(() => time?.m || 0);

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

function getTimeValue() {
  if (!hh.value && mm.value) {
    return `${mm.value}m`;
  }

  return `${hh.value}h ${mm.value.toString().padStart(2, '0')}m`;
}

function validate(): boolean {
  if (!label.value) {
    useToast().add({
      icon: 'i-ph-warning-duotone',
      title: 'Debe ingresar una etiqueta',
      color: 'orange'
    });
    return false;
  }

  if (!hh.value && !mm.value) {
    useToast().add({
      icon: 'i-ph-warning-duotone',
      title: 'Debe ingresar el tiempo',
      color: 'orange'
    });
    return false;
  }

  return true;
}

function saveNewTime() {
  if (!validate()) return;

  const newTime = {
    id: String(appStore.times.length + 1),
    label: label.value,
    value: getTimeValue(),
    raw: hh.value * 60 * 60 + mm.value * 60,
  };

  appStore.times.push(newTime);
  mode.value = 'normal';

  useToast().add({
    icon: 'i-ph-check',
    title: 'Tiempo agregado',
    color: 'green'
  });
}

function timeStringToNumber(item: string, time: 'h' | 'm'): number {
  return +item.split(' ').find((val: string) => val.includes(time))!.replace(time, '')
}

function editTime(row: Time) {
  mode.value = 'editing';
  itemId.value = row.id;
  label.value = row.label;
  time.h = timeStringToNumber(row.value, 'h')
  time.m = timeStringToNumber(row.value, 'm')
}

function saveEditedTime() {
  if (!validate()) return;

  appStore.times = appStore.times.map((t) => {
    if (t.id === itemId.value) {
      return {
        ...t,
        label: label.value,
        value: getTimeValue(),
        raw: hh.value * 60 * 60 + mm.value * 60,
      }
    }

    return t;
  });

  mode.value = 'normal';
  useToast().add({
    icon: 'i-ph-check',
    title: 'Tiempo editado',
    color: 'green'
  });
}

function deleteTime(row: Time) {
  if (isDelete.value && row.id === itemId.value) {
    appStore.times = appStore.times.filter((t) => t.id !== row.id);
    useToast().add({
      icon: 'i-ph-check',
      title: 'Tiempo eliminado',
      color: 'green'
    });
    return;
  }

  isDelete.value = true;
  itemId.value = row.id;
}

watch(isDelete, () => {
  setTimeout(() => {
    isDelete.value = false;
    itemId.value = '';
  }, 4000);
})
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
            <UButton color="green" variant="ghost" icon="i-ph-pencil-duotone" @click="editTime(row)" />
            <UButton color="red" variant="ghost"
              :icon="isDelete && itemId === row.id ? 'i-ph-check-duotone' : 'i-ph-trash-duotone'"
              @click="deleteTime(row)" />
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
              <UInput v-model.number="time.h" placeholder="hh" :iu="{ base: 'w-10' }" />
            </UFormGroup>
            <div>:</div>
            <UFormGroup required>
              <UInput v-model.number="time.m" placeholder="mm" :iu="{ base: 'w-10' }" />
            </UFormGroup>
          </div>
        </div>
      </section>

      <section class="mt-6 flex gap-2 justify-end" v-if="['creation', 'editing'].includes(mode)">
        <UButton color="cyan" variant="soft" icon="i-ph-floppy-disk" @click="saveNewTime" v-if="mode === 'creation'">
          Guardar</UButton>
        <UButton color="cyan" variant="soft" icon="i-ph-floppy-disk" @click="saveEditedTime" v-if="mode === 'editing'">
          Guardar
        </UButton>
        <UButton color="red" variant="ghost" icon="i-ph-x" @click="mode = 'normal'">Cancelar</UButton>
      </section>
    </UCard>
  </div>
</template>