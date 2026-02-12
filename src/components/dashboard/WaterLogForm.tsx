"use client";

import { useState } from "react";

const PARAMS = [
  { key: "temperature", label: "Temp (°F)", step: "0.1" },
  { key: "ph", label: "pH", step: "0.1" },
  { key: "ammonia", label: "Ammonia (ppm)", step: "0.01" },
  { key: "nitrite", label: "Nitrite (ppm)", step: "0.01" },
  { key: "nitrate", label: "Nitrate (ppm)", step: "1" },
  { key: "kh", label: "KH (dKH)", step: "0.5" },
  { key: "gh", label: "GH (dGH)", step: "0.5" },
  { key: "tds", label: "TDS (ppm)", step: "1" },
  { key: "co2Ppm", label: "CO2 (ppm)", step: "1" },
];

export function WaterLogForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => Promise<void> }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const data: Record<string, unknown> = {};
    for (const p of PARAMS) {
      if (values[p.key]) data[p.key] = Number(values[p.key]);
    }
    if (notes) data.notes = notes;
    await onSubmit(data);
    setValues({});
    setNotes("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-ocean-900">Log Water Parameters</h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {PARAMS.map((p) => (
          <div key={p.key}>
            <label className="mb-1 block text-xs text-gray-500">{p.label}</label>
            <input
              type="number"
              step={p.step}
              value={values[p.key] ?? ""}
              onChange={(e) => setValues({ ...values, [p.key]: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <input type="text" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={submitting} className="mt-3 rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
        {submitting ? "Saving..." : "Log Parameters"}
      </button>
    </form>
  );
}
