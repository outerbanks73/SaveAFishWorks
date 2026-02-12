"use client";

import { useState } from "react";

interface TankFormProps {
  initialData?: {
    name: string;
    gallons: number;
    lengthInch?: number | null;
    widthInch?: number | null;
    heightInch?: number | null;
    tankType: string;
    hasCO2: boolean;
    filterType?: string | null;
    lightType?: string | null;
    heaterWatts?: number | null;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function TankForm({ initialData, onSubmit }: TankFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [gallons, setGallons] = useState(initialData?.gallons ?? 20);
  const [lengthInch, setLengthInch] = useState(initialData?.lengthInch ?? "");
  const [widthInch, setWidthInch] = useState(initialData?.widthInch ?? "");
  const [heightInch, setHeightInch] = useState(initialData?.heightInch ?? "");
  const [tankType, setTankType] = useState(initialData?.tankType ?? "LOW_TECH");
  const [hasCO2, setHasCO2] = useState(initialData?.hasCO2 ?? false);
  const [filterType, setFilterType] = useState(initialData?.filterType ?? "");
  const [lightType, setLightType] = useState(initialData?.lightType ?? "");
  const [heaterWatts, setHeaterWatts] = useState(initialData?.heaterWatts ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      name,
      gallons: Number(gallons),
      lengthInch: lengthInch ? Number(lengthInch) : null,
      widthInch: widthInch ? Number(widthInch) : null,
      heightInch: heightInch ? Number(heightInch) : null,
      tankType,
      hasCO2,
      filterType: filterType || null,
      lightType: lightType || null,
      heaterWatts: heaterWatts ? Number(heaterWatts) : null,
    });
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ocean-900">Tank Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="My Planted Tank" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Gallons</label>
          <input type="number" value={gallons} onChange={(e) => setGallons(Number(e.target.value))} min={1} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Tank Type</label>
          <select value={tankType} onChange={(e) => setTankType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="LOW_TECH">Low Tech</option>
            <option value="HIGH_TECH">High Tech</option>
            <option value="NANO">Nano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Length (in)</label>
          <input type="number" value={lengthInch} onChange={(e) => setLengthInch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Width (in)</label>
          <input type="number" value={widthInch} onChange={(e) => setWidthInch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Height (in)</label>
          <input type="number" value={heightInch} onChange={(e) => setHeightInch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="co2" checked={hasCO2} onChange={(e) => setHasCO2(e.target.checked)} className="rounded" />
        <label htmlFor="co2" className="text-sm font-medium text-ocean-900">CO2 Injection</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Filter Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">None</option>
            <option value="Sponge">Sponge</option>
            <option value="HOB">Hang-on-Back</option>
            <option value="Canister">Canister</option>
            <option value="Internal">Internal</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Light Type</label>
          <input type="text" value={lightType} onChange={(e) => setLightType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. Fluval Plant 3.0" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ocean-900">Heater Watts</label>
        <input type="number" value={heaterWatts} onChange={(e) => setHeaterWatts(e.target.value)} className="w-full max-w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <button type="submit" disabled={submitting} className="rounded-lg bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-aqua-700 disabled:opacity-50">
        {submitting ? "Saving..." : initialData ? "Update Tank" : "Create Tank"}
      </button>
    </form>
  );
}
