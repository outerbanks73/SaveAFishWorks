"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface WaterLog {
  loggedAt: string;
  temperature?: number | null;
  ph?: number | null;
  ammonia?: number | null;
  nitrite?: number | null;
  nitrate?: number | null;
}

const LINES = [
  { key: "ph", color: "#0ea5e9", label: "pH" },
  { key: "ammonia", color: "#ef4444", label: "NH3" },
  { key: "nitrite", color: "#f59e0b", label: "NO2" },
  { key: "nitrate", color: "#22c55e", label: "NO3" },
];

export function WaterLogChart({ logs }: { logs: WaterLog[] }) {
  const data = [...logs].reverse().map((log) => ({
    date: new Date(log.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ph: log.ph,
    ammonia: log.ammonia,
    nitrite: log.nitrite,
    nitrate: log.nitrate,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          {LINES.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.label}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
