// src/api.ts

const API_URL = "http://13.50.101.252/api";

export type DataPoint = {
  date: string;
  speed: number;
  power: number;
  energy: number;
  latitude?: number;
  longitude?: number;
};

type AnyRow = Record<string, any>;

async function http<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return res.json() as Promise<T>;
}

function toDP(row: AnyRow): DataPoint | null {
  const date = String(row.timestamp ?? row.created_at ?? "").slice(0, 10);

  const speed = Number(row.speed_kmh);
  const power = Number(row.power_kw);
  const energy = Number(row.energy_kwh);

  return {
    date,
    speed: Number.isFinite(speed) ? speed : 0,
    power: Number.isFinite(power) ? power : 0,
    energy: Number.isFinite(energy) ? energy : 0,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  };
}

export const api = {
  list: async (): Promise<DataPoint[]> => {
    const raw = await http<AnyRow[]>(`/measurements`);
    return raw.map(toDP).filter(Boolean) as DataPoint[];
  },

  latest: async (): Promise<DataPoint | null> => {
    const raw = await http<AnyRow>(`/measurements/latest`);
    return toDP(raw);
  },
};
