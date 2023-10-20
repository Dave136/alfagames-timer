interface Time {
  id: string;
  label: string;
  value: string;
  raw: number;
}

type State = {
  times: Time[];
};

export const useAppStore = defineStore('app-store', {
  state: (): State => ({
    times: [
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
    ],
  }),
});
