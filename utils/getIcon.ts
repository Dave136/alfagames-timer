import { ConsoleNintendo, ConsoleXbox, ConsolePlayStation } from "#components";

export default function (icon: Icon) {
  const icons = {
    "i-xbox": ConsoleXbox,
    "i-nintendo": ConsoleNintendo,
    "i-playstation": ConsolePlayStation,
  };

  return icons[icon] || ConsoleXbox;
}
