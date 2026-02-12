"use client";

import { useState } from "react";

interface Livestock {
  id: string;
  speciesName: string;
  scientificName?: string | null;
  quantity: number;
  maxSizeInch?: number | null;
  temperament?: string | null;
  zone?: string | null;
}

export function LivestockManager({ tankId, initialLivestock }: { tankId: string; initialLivestock: Livestock[] }) {
  const [items, setItems] = useState(initialLivestock);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ speciesName: "", scientificName: "", quantity: 1, maxSizeInch: "", temperament: "", zone: "" });

  async function handleAdd() {
    const res = await fetch(`/api/tanks/${tankId}/livestock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxSizeInch: form.maxSizeInch ? Number(form.maxSizeInch) : null,
        temperament: form.temperament || null,
        zone: form.zone || null,
        scientificName: form.scientificName || null,
      }),
    });
    if (res.ok) {
      const { livestock } = await res.json();
      setItems((prev) => [...prev, livestock]);
      setForm({ speciesName: "", scientificName: "", quantity: 1, maxSizeInch: "", temperament: "", zone: "" });
      setAdding(false);
    }
  }

  async function handleRemove(livestockId: string) {
    await fetch(`/api/tanks/${tankId}/livestock`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ livestockId }),
    });
    setItems((prev) => prev.filter((i) => i.id !== livestockId));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ocean-900">Livestock ({items.length})</h2>
        <button onClick={() => setAdding(!adding)} className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="mb-4 rounded-lg border border-aqua-200 bg-aqua-50/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Species name *" value={form.speciesName} onChange={(e) => setForm({ ...form, speciesName: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" placeholder="Scientific name" value={form.scientificName} onChange={(e) => setForm({ ...form, scientificName: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <input type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min={1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="number" placeholder="Max size (in)" value={form.maxSizeInch} onChange={(e) => setForm({ ...form, maxSizeInch: e.target.value })} step="0.1" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={form.temperament} onChange={(e) => setForm({ ...form, temperament: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Temperament</option>
              <option value="peaceful">Peaceful</option>
              <option value="semi-aggressive">Semi-aggressive</option>
              <option value="aggressive">Aggressive</option>
            </select>
            <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Zone</option>
              <option value="top">Top</option>
              <option value="mid">Mid</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <button onClick={handleAdd} disabled={!form.speciesName} className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
            Add Livestock
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No livestock added.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ocean-900">{item.speciesName} <span className="text-gray-400">x{item.quantity}</span></p>
                {item.scientificName && <p className="text-xs italic text-gray-500">{item.scientificName}</p>}
                <p className="text-xs text-gray-400">
                  {[item.temperament, item.zone && `${item.zone} dweller`, item.maxSizeInch && `${item.maxSizeInch}"`].filter(Boolean).join(" · ")}
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
