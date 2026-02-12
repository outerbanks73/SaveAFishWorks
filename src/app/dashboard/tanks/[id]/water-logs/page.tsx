"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { WaterLogForm } from "@/components/dashboard/WaterLogForm";
import { WaterLogChart } from "@/components/dashboard/WaterLogChart";

interface WaterLog {
  id: string;
  loggedAt: string;
  temperature?: number | null;
  ph?: number | null;
  ammonia?: number | null;
  nitrite?: number | null;
  nitrate?: number | null;
  kh?: number | null;
  gh?: number | null;
  tds?: number | null;
  co2Ppm?: number | null;
  notes?: string | null;
}

export default function WaterLogsPage() {
  const params = useParams();
  const tankId = params.id as string;
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    const res = await fetch(`/api/tanks/${tankId}/water-logs?limit=50`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
    }
    setLoading(false);
  }, [tankId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  async function handleAdd(data: Record<string, unknown>) {
    const res = await fetch(`/api/tanks/${tankId}/water-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchLogs();
    }
  }

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Water Logs</h1>

      <WaterLogForm onSubmit={handleAdd} />

      {logs.length > 1 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-ocean-900">Trends</h2>
          <WaterLogChart logs={logs} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-ocean-900">History</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">No water logs yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-lg border border-gray-200 p-4">
                <p className="mb-2 text-sm font-medium text-ocean-900">{new Date(log.loggedAt).toLocaleDateString()}</p>
                <div className="grid grid-cols-3 gap-2 text-xs sm:grid-cols-5">
                  {log.temperature != null && <Param label="Temp" value={`${log.temperature}°F`} />}
                  {log.ph != null && <Param label="pH" value={log.ph.toString()} />}
                  {log.ammonia != null && <Param label="NH3" value={`${log.ammonia} ppm`} warn={log.ammonia > 0} />}
                  {log.nitrite != null && <Param label="NO2" value={`${log.nitrite} ppm`} warn={log.nitrite > 0} />}
                  {log.nitrate != null && <Param label="NO3" value={`${log.nitrate} ppm`} warn={log.nitrate > 40} />}
                  {log.kh != null && <Param label="KH" value={`${log.kh} dKH`} />}
                  {log.gh != null && <Param label="GH" value={`${log.gh} dGH`} />}
                  {log.tds != null && <Param label="TDS" value={`${log.tds} ppm`} />}
                  {log.co2Ppm != null && <Param label="CO2" value={`${log.co2Ppm} ppm`} />}
                </div>
                {log.notes && <p className="mt-2 text-xs text-gray-500">{log.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Param({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={warn ? "text-red-600" : "text-gray-600"}>
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
}
