"use client";

import { useState, useMemo } from "react";
import { DOSING_METHODS, BRANDS, getProductsByBrand, getProductsByMethod } from "@/lib/maintenance/dosing-data";
import { calculateFullSchedule } from "@/lib/maintenance/dosing-calculator";

interface Props {
  tankGallons: number;
  hasCO2: boolean;
  tankId: string;
}

export function DosingCalculator({ tankGallons, hasCO2, tankId }: Props) {
  const [method, setMethod] = useState("ALL_IN_ONE");
  const [brand, setBrand] = useState(BRANDS[0]);
  const [plantLoad, setPlantLoad] = useState("medium");
  const [saving, setSaving] = useState(false);

  const products = useMemo(() => {
    const byBrand = getProductsByBrand(brand);
    const byMethod = getProductsByMethod(method);
    // Prefer products matching both brand and method, fall back to brand only
    const matching = byBrand.filter((p) => p.method === method);
    return matching.length > 0 ? matching : byMethod.length > 0 ? byMethod : byBrand;
  }, [brand, method]);

  const schedule = useMemo(
    () => calculateFullSchedule({ tankGallons, method, products, hasCO2, plantLoad }),
    [tankGallons, method, products, hasCO2, plantLoad]
  );

  async function handleSave() {
    setSaving(true);
    for (const dose of schedule.doses) {
      await fetch(`/api/tanks/${tankId}/dosing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          fertBrand: dose.brand,
          fertProductName: dose.product,
          doseAmountMl: dose.doseAmount,
          notes: dose.notes,
        }),
      });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Dosing Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {DOSING_METHODS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Brand</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Plant Load</label>
          <select value={plantLoad} onChange={(e) => setPlantLoad(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
        <p className="text-ocean-900"><span className="font-medium">Tank:</span> {tankGallons}G &middot; CO2: {hasCO2 ? "Yes" : "No"} &middot; Water change: {schedule.waterChangePercent}% weekly</p>
      </div>

      {/* Results */}
      {schedule.doses.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-ocean-900">Calculated Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 font-medium text-ocean-900">Product</th>
                  <th className="pb-2 font-medium text-ocean-900">Per Dose</th>
                  <th className="pb-2 font-medium text-ocean-900">Frequency</th>
                  <th className="pb-2 font-medium text-ocean-900">Weekly Total</th>
                </tr>
              </thead>
              <tbody>
                {schedule.doses.map((dose, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2">
                      <p className="font-medium text-ocean-900">{dose.product}</p>
                      <p className="text-xs text-gray-500">{dose.brand}</p>
                    </td>
                    <td className="py-2 text-gray-700">{dose.doseAmount} {dose.doseUnit}</td>
                    <td className="py-2 text-gray-700">{dose.frequency}</td>
                    <td className="py-2 font-medium text-ocean-900">{dose.weeklyTotal} {dose.weeklyUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {schedule.notes.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-semibold text-amber-800">Notes</p>
          <ul className="space-y-1">
            {schedule.notes.map((note, i) => (
              <li key={i} className="text-xs text-amber-700">{note}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSave} disabled={saving || schedule.doses.length === 0} className="rounded-lg bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-aqua-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Schedule"}
      </button>
    </div>
  );
}
