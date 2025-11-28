import { normalize, type DataPoint } from "./data";

const API_URL = "http://13.50.101.252/api";

async function httpJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  list: async (): Promise<DataPoint[]> => {
    const raw = await httpJson<unknown>("/measurements");
    return normalize(raw);
  },

  latest: async (): Promise<DataPoint | null> => {
    const raw = await httpJson<unknown>("/measurements/latest");
    const arr = normalize([raw]);
    return arr.length ? arr[0] : null;
  },
};
