const soundsList: Sound[] = [
  {
    id: '1',
    name: 'Good bad ugly',
    path: 'good-bad-ugly-ring.mp3',
  },
  {
    id: '2',
    name: 'Mario Lost Life',
    path: 'mario-lost-life.mp3',
  },
  {
    id: '3',
    name: 'Nani full',
    path: 'nani-full.mp3',
  },
  {
    id: '4',
    name: 'Ultra instinct',
    path: 'ultra-instinct.mp3',
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
});
