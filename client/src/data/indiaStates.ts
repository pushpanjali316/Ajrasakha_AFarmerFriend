export type StateInfo = {
  name: string;
  center: [number, number];
  zoom: number;
};

export const INDIA_STATES: StateInfo[] = [
  {
    name: "Tamil Nadu",
    center: [11.1271, 78.6569],
    zoom: 7,
  },
  {
    name: "Andhra Pradesh",
    center: [15.9129, 79.74],
    zoom: 7,
  },
  {
    name: "Karnataka",
    center: [15.3173, 75.7139],
    zoom: 7,
  },
  {
    name: "Kerala",
    center: [10.8505, 76.2711],
    zoom: 8,
  },
  {
    name: "Punjab",
    center: [31.1471, 75.3412],
    zoom: 7,
  },
];
