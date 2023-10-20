export const songsList = [
  {
    id: "1",
    name: "Good bad ugly",
    path: "/sounds/good-bad-ugly-ring.mp3",
  },
  {
    id: "2",
    name: "Mario Lost Life",
    path: "/sounds/mario-lost-life.mp3",
  },
  {
    id: "3",
    name: "Nani!",
    path: "/sounds/nani-full.mp3",
  },
  {
    id: "4",
    name: "Ultra instinct",
    path: "/sounds/ultra-instinct.mp3",
  },
];

export default function (id: string) {
  const song = songsList.find((s) => s.id === id);
  return song;
}
