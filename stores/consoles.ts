interface ConsolesState {
  consoles: Consoles[];
  selected: Consoles | null;
}

export const DEFAULT_VALUES = {
  time: 0,
  countdown: 0,
  currentTime: 0,
  formatted: '',
  endedTime: '',
  finished: false,
};

const initialConsolesState: Consoles[] = [
  {
    id: '1',
    order: 1,
    name: 'Xbox 1',
    icon: 'i-xbox',
    countdown: 0,
  },
  {
    id: '2',
    order: 2,
    icon: 'i-nintendo',
    name: 'Nintendo Switch',
    countdown: 0,
  },
  {
    id: '3',
    order: 3,
    icon: 'i-xbox',
    name: 'Xbox 2',
    countdown: 0,
  },
  {
    id: '4',
    order: 4,
    icon: 'i-playstation',
    name: 'Playstation 5',
    countdown: 0,
  },
  {
    id: '5',
    order: 5,
    icon: 'i-xbox',
    name: 'Xbox 3',
    countdown: 0,
  },
];

export const useConsolesStore = defineStore('consoles-store', {
  state: (): ConsolesState => ({
    consoles: initialConsolesState,
    selected: null,
  }),
  actions: {
    transferTime(current: string, target: string) {
      const toast = useToast();
      const currentConsole = this.consoles.find((c) => c.id === current);
      const targetConsole = this.consoles.find((c) => c.id === target);

      if (!currentConsole) {
        toast.add({
          color: 'red',
          icon: 'i-ph-x-circle-duotone',
          title: 'Error',
          description: `Consola no encontrada o no disponible`,
        });
        return;
      }

      this.consoles = this.consoles.map((c) => {
        // Reset current
        if (c.id === current) {
          return {
            ...c,
            futureTime: '',
            currentTime: 0,
            countdown: 0,
          };
        }

        // Transfer to the target
        if (c.id === target) {
          return {
            ...c,
            futureTime: currentConsole.futureTime,
            currentTime: currentConsole.currentTime,
            countdown: currentConsole.currentTime as number,
          };
        }

        return c;
      });

      toast.add({
        icon: 'i-ph-check',
        color: 'green',
        title: currentConsole?.name,
        description: `Tiempo transferido a ${targetConsole?.name}`,
      });
    },
    resetData(id: string) {
      const toast = useToast();
      const console = this.consoles.find((c) => c.id === id);

      this.consoles = this.consoles.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...DEFAULT_VALUES,
          };
        }

        return c;
      });

      toast.add({
        icon: 'i-ph-check',
        color: 'green',
        title: console?.name,
        description: 'Tiempo finalizado',
      });
    },
    stop(id: string) {
      const toast = useToast();
      const console = this.consoles.find((c) => c.id === id);

      this.consoles = this.consoles.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...DEFAULT_VALUES,
          };
        }

        return c;
      });

      toast.add({
        icon: 'i-ph-check',
        color: 'green',
        title: console?.name,
        description: 'Tiempo reseteado',
      });
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
