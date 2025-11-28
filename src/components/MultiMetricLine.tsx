import "./MultiMetricLine.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { METRICS, mean, DataPoint } from "../data";
import { useState } from "react";

type Props = { data: DataPoint[] };

export default function MultiMetricLine({ data }: Props) {
  const [visible, setVisible] = useState({
    speed: true,
    power: true,
    energy: true,
  });

  const toggle = (k: keyof typeof visible) =>
    setVisible((v) => ({ ...v, [k]: !v[k] }));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {Object.entries(METRICS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => toggle(k as any)}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid " + v.color,
              background: visible[k as keyof typeof visible] ? v.color : "transparent",
              color: visible[k as keyof typeof visible] ? "#fff" : v.color,
              cursor: "pointer",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" tickFormatter={(v) => v.toFixed(0)} />

            <Tooltip
              labelFormatter={(date) => `📅 ${date}`}
              formatter={(value, name, props: any) => {
                const key = props.dataKey as keyof typeof METRICS;
                const meta = METRICS[key];
                return [`${Number(value).toFixed(1)} ${meta.unit}`, meta.label];
              }}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e5e7eb",
              }}
            />


            <Legend formatter={(v) => METRICS[v as keyof typeof METRICS].label} />

            {visible.speed && (
              <Line type="monotone" dataKey="speed" stroke={METRICS.speed.color} strokeWidth={3} />
            )}
            {visible.power && (
              <Line type="monotone" dataKey="power" stroke={METRICS.power.color} strokeWidth={3} strokeDasharray="3 3" />
            )}
            {visible.energy && (
              <Line type="monotone" dataKey="energy" stroke={METRICS.energy.color} strokeWidth={3} strokeDasharray="6 3" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
