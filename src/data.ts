export type MetricKey = "speed" | "power" | "energy";

export interface MetricsMeta {
  label: string;
  unit: string;
  color: string;
}

export const METRICS: Record<MetricKey, MetricsMeta> = {
  speed: { label: "Velocità", unit: "km/h", color: "#06b6d4" },
  power: { label: "Potenza", unit: "kW", color: "#fbbf24" },
  energy: { label: "Energia", unit: "kWh", color: "#a78bfa" },
};

export interface DataPoint {
  date: string; // orario leggibile
  speed: number;
  power: number;
  energy: number;
}

type AnyRow = Record<string, unknown>;

export function toDataPoint(row: AnyRow): DataPoint | null {
  const raw = row.timestamp ?? row.date ?? row.created_at;
  if (!raw) return null;

  const d = new Date(String(raw));
  const date = d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const speed = Number(row.speed_kmh ?? row.speed ?? 0);
  const power = Number(row.power_kw ?? row.power ?? 0);
  const energy = Number(row.energy_kwh ?? row.energy ?? 0);

  return { date, speed, power, energy };
}

export function normalize(input: unknown): DataPoint[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((r) => toDataPoint(r as AnyRow))
    .filter(Boolean) as DataPoint[];
}
