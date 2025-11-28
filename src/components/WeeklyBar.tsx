import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type Props = {
  data: { week: string; value: number }[];
  color: string;
};

export default function WeeklyBar({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <XAxis
          dataKey="week"
          stroke="#cbd5e1"
          tick={{ fontSize: 11 }}
          tickMargin={10}
        />
        <YAxis
          stroke="#cbd5e1"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => v.toFixed(0)}
        />
        <Tooltip
          formatter={(v) => `${Number(v).toFixed(1)}`}
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #334155",
            color: "#e5e7eb",
            borderRadius: 8,
          }}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
