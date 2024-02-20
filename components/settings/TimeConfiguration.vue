<script setup lang="ts">
const appStore = useAppStore();

const mode = ref<'creation' | 'editing' | 'normal'>('normal');
const itemId = ref('');
const isDelete = ref(false);

const form = ref<Record<any, any> | null>(null);
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

function getTimeValue({ hh = 0, mm = 0 }: { hh?: number, mm?: number }): string {
  if (!hh && mm) {
    return `${mm}m`;
  }

  if (!mm && hh) {
    return `${hh}h`;
  }

  return `${hh}h ${mm.toString().padStart(2, '0')}m`;
}

async function saveNewTime() {
  try {
    const hh = form.value!.state.h;
    const mm = form.value!.state.m;

    await form.value?.form!.validate();

    const newTime = {
      id: String(appStore.times.length + 1),
      label: form.value!.state.label,
      value: getTimeValue({
        hh: form.value!.state.h,
        mm: form.value!.state.m
      }),
      raw: hh * 60 * 60 + mm * 60
    };

    appStore.times.push(newTime);
    mode.value = 'normal';

    useToast().add({
      icon: 'i-ph-check',
      title: 'Tiempo agregado',
      color: 'green'
    });
  } catch (error) {
    console.log(error);
    useToast().add({
      icon: 'i-ph-warning',
      title: 'Advertencia',
      description: 'Debe completar los campos requeridos',
      color: 'red'
    });
  }
}

function timeStringToNumber(item: string, time: 'h' | 'm'): number | undefined {
  if (item.includes(' ')) {
    return +item.split(' ').find((val: string) => val.includes(time))!.replace(time, '');
  }

  return item.includes(time) ? +item.replace(time, '') : undefined;
}

function editTime(row: Time) {
  mode.value = 'editing';
  itemId.value = row.id;

  setTimeout(() => {
    form.value!.state.label = row.label;
    form.value!.state.h = timeStringToNumber(row.value, 'h');
    form.value!.state.m = timeStringToNumber(row.value, 'm');
  }, 200);
}

function saveEditedTime() {
  try {
    form.value?.form!.validate();

    appStore.times = appStore.times.map((t) => {
      if (t.id === itemId.value) {
        const hh = form.value!.state.h;
        const mm = form.value!.state.m;

        return {
          ...t,
          label: form.value!.state.label,
          value: getTimeValue({
            hh: form.value!.state.h,
            mm: form.value!.state.m
          }),
          raw: hh * 60 * 60 + mm * 60,
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
  } catch (error) {
    console.log(error);
    useToast().add({
      icon: 'i-ph-warning',
      title: 'Advertencia',
      description: 'Revise los errores',
      color: 'red'
    });
  }
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
  <UCard>
    <template #header>
      <header class="flex items-center justify-between">
        <h4 class="text-lg">Tiempo</h4>
        <UButton color="green" variant="soft" icon="i-ph-plus" @click="mode = 'creation'" size="xs">Agregar</UButton>
      </header>
    </template>

    <section>
      <UTable :rows="appStore.times" :columns="columns">
        <template #actions-data="{ row }">
          <UButton color="green" variant="ghost" icon="i-ph-pencil-duotone" @click="editTime(row)" size="xs" />
          <UButton color="red" variant="ghost"
            :icon="isDelete && itemId === row.id ? 'i-ph-check-duotone' : 'i-ph-trash-duotone'" size="xs"
            @click="deleteTime(row)" />
        </template>
      </UTable>
    </section>

    <ConfigurationTimeForm ref="form" v-if="['creation', 'editing'].includes(mode)" />

    <section class="mt-6 flex gap-2 justify-end" v-if="['creation', 'editing'].includes(mode)">
      <UButton color="cyan" variant="soft" icon="i-ph-floppy-disk" @click="saveNewTime" v-if="mode === 'creation'"
        size="xs">
        Guardar</UButton>
      <UButton color="cyan" variant="soft" icon="i-ph-floppy-disk" @click="saveEditedTime" v-if="mode === 'editing'"
        size="xs">
        Guardar
      </UButton>
      <UButton color="red" variant="ghost" icon="i-ph-x" @click="mode = 'normal'" size="xs">Cancelar</UButton>
    </section>
  </UCard>
</template>
