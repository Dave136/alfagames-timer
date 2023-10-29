interface CustomTimeData {
  h: number;
  m: number;
}

interface Consoles {
  id: string;
  order: number;
  name: string;
  icon: Icon;
  time?: number;
  countdown: number;
  currentTime?: number;
  formatted?: string;
  futureTime?: string;
  finished?: boolean;
}

interface Sound {
  id: string;
  name: string;
  path: string;
  url: string;
  downloaded: boolean;
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
