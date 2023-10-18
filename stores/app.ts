type State = {
  times: number;
};

export const useAppStore = defineStore("app-store", {
  state: (): State => ({
    times: 0,
  }),
});
