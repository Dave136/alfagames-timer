import { LogoNintendo, LogoXbox, LogoPlayStation } from '#components';

export default function (icon?: Icon) {
  const icons = {
    'i-xbox': LogoXbox,
    'i-nintendo': LogoNintendo,
    'i-playstation': LogoPlayStation,
  };

  return icons[icon || 'i-xbox'] || LogoXbox;
}
