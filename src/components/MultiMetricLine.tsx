import "./MultiMetricLine.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { METRICS, type DataPoint, type MetricKey } from "../data";

type Props = {
  data: DataPoint[];
  metric: MetricKey;
};

export default function MultiMetricLine({ data, metric }: Props) {
  const meta = METRICS[metric];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="date" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
          <YAxis stroke="#cbd5e1" tick={{ fontSize: 11 }} />

          <Tooltip
            formatter={(value) => `${Number(value).toFixed(1)} ${meta.unit}`}
            labelFormatter={(label) => `🕒 ${label}`}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 6,
            }}
          />

          <Line
            type="monotone"
            name={meta.label}
            dataKey={metric}
            stroke={meta.color}
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
