"use client";

import { useState } from "react";

interface Plant {
  id: string;
  plantName: string;
  scientificName?: string | null;
  quantity: number;
  placement?: string | null;
  co2Required: boolean;
  lightNeed?: string | null;
}

export function PlantManager({ tankId, initialPlants }: { tankId: string; initialPlants: Plant[] }) {
  const [items, setItems] = useState(initialPlants);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ plantName: "", scientificName: "", quantity: 1, placement: "", co2Required: false, lightNeed: "" });

  async function handleAdd() {
    const res = await fetch(`/api/tanks/${tankId}/plants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        scientificName: form.scientificName || null,
        placement: form.placement || null,
        lightNeed: form.lightNeed || null,
      }),
    });
    if (res.ok) {
      const { plant } = await res.json();
      setItems((prev) => [...prev, plant]);
      setForm({ plantName: "", scientificName: "", quantity: 1, placement: "", co2Required: false, lightNeed: "" });
      setAdding(false);
    }
  }

  async function handleRemove(plantId: string) {
    await fetch(`/api/tanks/${tankId}/plants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantId }),
    });
    setItems((prev) => prev.filter((i) => i.id !== plantId));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ocean-900">Plants ({items.length})</h2>
        <button onClick={() => setAdding(!adding)} className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="mb-4 rounded-lg border border-aqua-200 bg-aqua-50/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Plant name *" value={form.plantName} onChange={(e) => setForm({ ...form, plantName: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" placeholder="Scientific name" value={form.scientificName} onChange={(e) => setForm({ ...form, scientificName: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min={1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Placement</option>
              <option value="foreground">Foreground</option>
              <option value="midground">Midground</option>
              <option value="background">Background</option>
              <option value="floating">Floating</option>
            </select>
            <select value={form.lightNeed} onChange={(e) => setForm({ ...form, lightNeed: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Light need</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="co2req" checked={form.co2Required} onChange={(e) => setForm({ ...form, co2Required: e.target.checked })} />
            <label htmlFor="co2req" className="text-sm text-ocean-900">Requires CO2</label>
          </div>
          <button onClick={handleAdd} disabled={!form.plantName} className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
            Add Plant
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No plants added.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ocean-900">{item.plantName} <span className="text-gray-400">x{item.quantity}</span></p>
                {item.scientificName && <p className="text-xs italic text-gray-500">{item.scientificName}</p>}
                <p className="text-xs text-gray-400">
                  {[item.placement, item.lightNeed && `${item.lightNeed} light`, item.co2Required && "CO2"].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
