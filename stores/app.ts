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

// TODO: migrate and rename for useTimeStore
export const useAppStore = defineStore('app-store', {
  state: (): State => ({
    times: initialState,
  }),
  persist: {
    storage: persistedState.localStorage,
  },
});

export const useApp2Store = defineStore(
  'app2-store',
  () => {
    const dataDir = ref('');
    const soundsDir = ref<import('@tauri-apps/api/fs').FileEntry[]>([]);
    const modals = reactive({
      about: false,
      settings: false,
    });

    async function initialize() {
      const { createDir, readDir, BaseDirectory } = await import(
        '@tauri-apps/api/fs'
      );
      const { appLocalDataDir } = await import('@tauri-apps/api/path');

      try {
        dataDir.value = await appLocalDataDir();
        soundsDir.value = await readDir('sounds', {
          dir: BaseDirectory.AppLocalData,
        });
      } catch (error: any) {
        if (error.includes('sounds')) {
          console.log('error reading...');
          console.log('Creating sounds directory...');
          await createDir('sounds', { dir: BaseDirectory.AppLocalData });
          console.log('Calling function again...');
          initialize();
          return;
        }
      }
    }

    return {
      dataDir,
      modals,
      soundsDir,
      initialize,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
