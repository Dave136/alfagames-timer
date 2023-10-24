interface Sound {
  id: string;
  name: string;
  path: string;
  url: string;
}

type Icon = 'i-xbox' | 'i-nintendo' | 'i-playstation';

type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

interface Time {
  id: string;
  label: string;
  value: string;
  raw: number;
}
