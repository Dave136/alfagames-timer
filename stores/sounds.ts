const soundsList: Sound[] = [
  {
    id: '1',
    name: 'Good bad ugly',
    path: 'good-bad-ugly-ring.mp3',
    url: 'https://btones.b-cdn.net/fetch/7a/7a8c0ba1979256fa078efd752b355ae7.mp3?download=good-bad-ugly-ring%20meloboom.mp3',
  },
  {
    id: '2',
    name: 'Mario Lost Life',
    path: 'mario-lost-life.mp3',
    url: 'https://btones.b-cdn.net/fetch/56/5634ccc623b56abfb7d5756a625c54f5.mp3?download=mario-bros-die%20meloboom.mp3',
  },
  {
    id: '3',
    name: 'Nani full',
    path: 'nani-full.mp3',
    url: 'https://btones.b-cdn.net/fetch/55/55af10ebd16e5ecf0d2496b9c561c57b.mp3?download=nani-full%20meloboom.mp3',
  },
  {
    id: '4',
    name: 'Ultra instinct',
    path: 'ultra-instinct.mp3',
    url: 'https://btones.b-cdn.net/fetch/16/1603eaf2e22b7e2a6dcb84e9d0bd5343.mp3?download=ultra-instinct%20meloboom.mp3',
  },
];

interface SoundsState {
  sounds: Sound[];
  selected: Sound | null;
}

export const useSoundsStore = defineStore('sounds-store', {
  state: (): SoundsState => ({
    sounds: soundsList,
    selected: soundsList[1],
  }),
  persist: {
    storage: persistedState.localStorage,
  },
});
