"use client";

import { useState } from "react";

interface Equipment {
  id: string;
  equipmentType: string;
  brand?: string | null;
  model?: string | null;
  notes?: string | null;
}

export function EquipmentManager({ tankId, initialEquipment }: { tankId: string; initialEquipment: Equipment[] }) {
  const [items, setItems] = useState(initialEquipment);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ equipmentType: "", brand: "", model: "", notes: "" });

  async function handleAdd() {
    const res = await fetch(`/api/tanks/${tankId}/equipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        brand: form.brand || null,
        model: form.model || null,
        notes: form.notes || null,
      }),
    });
    if (res.ok) {
      const { equipment } = await res.json();
      setItems((prev) => [...prev, equipment]);
      setForm({ equipmentType: "", brand: "", model: "", notes: "" });
      setAdding(false);
    }
  }

  async function handleRemove(equipmentId: string) {
    await fetch(`/api/tanks/${tankId}/equipment`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipmentId }),
    });
    setItems((prev) => prev.filter((i) => i.id !== equipmentId));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ocean-900">Equipment ({items.length})</h2>
        <button onClick={() => setAdding(!adding)} className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="mb-4 rounded-lg border border-aqua-200 bg-aqua-50/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select value={form.equipmentType} onChange={(e) => setForm({ ...form, equipmentType: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Type *</option>
              <option value="Filter">Filter</option>
              <option value="Heater">Heater</option>
              <option value="Light">Light</option>
              <option value="CO2 System">CO2 System</option>
              <option value="Air Pump">Air Pump</option>
              <option value="Skimmer">Skimmer</option>
              <option value="Timer">Timer</option>
              <option value="Thermometer">Thermometer</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button onClick={handleAdd} disabled={!form.equipmentType} className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
            Add Equipment
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No equipment added.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ocean-900">{item.equipmentType}</p>
                <p className="text-xs text-gray-500">
                  {[item.brand, item.model].filter(Boolean).join(" ") || "No details"}
                </p>
                {item.notes && <p className="text-xs text-gray-400">{item.notes}</p>}
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
