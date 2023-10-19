interface Consoles {
  id: string;
  order: number;
  name: string;
  icon: Icon;
  time?: number;
  countdown: number;
  currentTime?: number;
  formatted?: string;
  futureTime?: string;
  finished?: boolean;
}

interface ConsolesState {
  consoles: Consoles[];
  selected: Consoles | null;
}

const DEFAULT_VALUES = {
  time: 0,
  countdown: 0,
  currentTime: 0,
  formatted: "",
  endedTime: "",
  finished: false,
};

const initialConsolesState: Consoles[] = [
  {
    id: "1",
    order: 1,
    name: "Xbox 1",
    icon: "i-xbox",
    countdown: 0,
  },
  {
    id: "2",
    order: 2,
    icon: "i-nintendo",
    name: "Nintendo Switch",
    countdown: 0,
  },
  {
    id: "3",
    order: 3,
    icon: "i-xbox",
    name: "Xbox 2",
    countdown: 0,
  },
  {
    id: "4",
    order: 4,
    icon: "i-playstation",
    name: "Playstation 5",
    countdown: 0,
  },
  {
    id: "5",
    order: 5,
    icon: "i-xbox",
    name: "Xbox 3",
    countdown: 0,
  },
];

export const useConsolesStore = defineStore("consoles-store", {
  state: (): ConsolesState => ({
    consoles: initialConsolesState,
    selected: null,
  }),
  actions: {
    resetData(id: string) {
      const toast = useToast();

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
        icon: "i-ph-check-circle",
        description: "Tiempo finalizado",
        title: "Tiempo",
      });
    },
  },
});
