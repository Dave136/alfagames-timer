import { ConsoleNintendo, ConsoleXbox, ConsolePlayStation } from "#components";

interface Consoles {
  id: string;
  order: number;
  name: string;
  icon: Component;
  countdown: number;
}

interface ConsolesState {
  consoles: Consoles[];
  selected: Consoles | null;
}

const initialConsolesState: Consoles[] = [
  {
    id: "1",
    order: 1,
    name: "Xbox 1",
    icon: ConsoleXbox,
    countdown: 0,
  },
  {
    id: "2",
    order: 2,
    icon: ConsoleNintendo,
    name: "Nintendo Switch",
    countdown: 0,
  },
  {
    id: "3",
    order: 3,
    icon: ConsoleXbox,
    name: "Xbox 2",
    countdown: 0,
  },
  {
    id: "4",
    order: 4,
    icon: ConsolePlayStation,
    name: "Playstation 5",
    countdown: 0,
  },
  {
    id: "5",
    order: 5,
    icon: ConsoleXbox,
    name: "Xbox 3",
    countdown: 0,
  },
];

export const useConsolesStore = defineStore("consoles-store", {
  state: (): ConsolesState => ({
    consoles: initialConsolesState,
    selected: null,
  }),
});
