type State = {
  consoleSelected: {
    id?: string;
  } & Record<string, any>;
};

export const useAppStore = defineStore("app", {
  state: (): State => ({
    consoleSelected: {},
  }),
});
