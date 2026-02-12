"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DosingCalculator } from "@/components/dashboard/DosingCalculator";

interface DosingSchedule {
  id: string;
  method: string;
  fertBrand?: string | null;
  fertProductName?: string | null;
  doseAmountMl?: number | null;
  frequencyDays?: number | null;
  dayPattern?: string | null;
  notes?: string | null;
}

interface TankData {
  id: string;
  name: string;
  gallons: number;
  hasCO2: boolean;
  tankType: string;
}

export default function DosingPage() {
  const params = useParams();
  const tankId = params.id as string;
  const [tank, setTank] = useState<TankData | null>(null);
  const [schedules, setSchedules] = useState<DosingSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/tanks/${tankId}`).then((r) => r.json()),
      fetch(`/api/tanks/${tankId}/dosing`).then((r) => r.json()),
    ]).then(([tankData, dosingData]) => {
      setTank(tankData.tank);
      setSchedules(dosingData.schedules ?? []);
      setLoading(false);
    });
  }, [tankId]);

  if (loading || !tank) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Dosing — {tank.name}</h1>

      <DosingCalculator tankGallons={tank.gallons} hasCO2={tank.hasCO2} tankId={tankId} />

      {schedules.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-ocean-900">Saved Schedules</h2>
          <div className="space-y-2">
            {schedules.map((s) => (
              <div key={s.id} className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm font-medium text-ocean-900">
                  {s.fertBrand} {s.fertProductName} — {s.method}
                </p>
                {s.doseAmountMl && <p className="text-xs text-gray-500">{s.doseAmountMl}ml every {s.frequencyDays} days</p>}
                {s.notes && <p className="text-xs text-gray-400">{s.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
