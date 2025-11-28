// src/data.ts

export type MetricKey = "speed" | "power" | "energy";

export interface MetricsMeta {
  label: string;
  unit: string;
  color: string;
}

export const METRICS: Record<MetricKey, MetricsMeta> = {
  speed: { label: "Velocità", unit: "km/h", color: "#06b6d4" },
  power: { label: "Potenza", unit: "kW", color: "#22c55e" },
  energy: { label: "Energia", unit: "kWh", color: "#a78bfa" },
};

export interface DataPoint {
  date: string;
  speed: number;
  power: number;
  energy: number;
  latitude?: number;
  longitude?: number;
}

export function mean(arr: number[]) {
  return arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0;
}

export function filterData(
  data: DataPoint[],
  mode: "preset" | "custom",
  days?: number,
  start?: string,
  end?: string
): DataPoint[] {
  if (!data.length) return [];
  if (mode !== "custom") {
    const n = days ?? 30;
    const s = new Date();
    s.setDate(s.getDate() - (n - 1));
    return data.filter((r) => new Date(r.date) >= s);
  }
  const S = start ? new Date(start) : new Date(data[0].date);
  const E = end ? new Date(end) : new Date(data[data.length - 1].date);
  return data.filter((r) => {
    const d = new Date(r.date);
    return d >= S && d <= E;
  });
}

export function weeklyAverage(data: DataPoint[], key: MetricKey) {
  const map = new Map<string, number[]>();

  data.forEach((d) => {
    const week = d.date;
    if (!map.has(week)) map.set(week, []);
    map.get(week)!.push(d[key]);
  });

  return [...map.entries()].map(([week, arr]) => ({
    week,
    value: mean(arr),
  }));
}
