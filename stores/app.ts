type State = {
  times: Time[];
};

const devState = [
  {
    id: '1',
    label: '30s',
    value: '30',
    raw: 30,
  },
  {
    id: '2',
    label: '1m',
    value: '1m',
    raw: 60,
  },
  {
    id: '3',
    label: '20m',
    value: '20m',
    raw: 20 * 60,
  },
];

const initialState = import.meta.env.MODE === 'development' ? devState : [];

export const useAppStore = defineStore('app-store', {
  state: (): State => ({
    times: initialState,
  }),
  persist: {
    storage: persistedState.localStorage,
  },
});
