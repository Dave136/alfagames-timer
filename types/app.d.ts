interface Sound {
  id: string;
  name: string;
  path: string;
}

type Icon = 'i-xbox' | 'i-nintendo' | 'i-playstation';

interface Time {
  id: string;
  label: string;
  value: string;
  raw: number;
}
