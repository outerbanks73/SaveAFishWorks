"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  frequencyDays: number;
  nextDue: string;
  lastCompleted?: string | null;
  tank: { id: string; name: string };
}

const CATEGORY_ICONS: Record<string, string> = {
  WATER_CHANGE: "💧", FILTER_CLEAN: "🔧", GLASS_CLEAN: "🪟", GRAVEL_VAC: "🧹",
  WATER_TEST: "🧪", FERT_DOSE: "🌿", CO2_REFILL: "💨", TRIMMING: "✂️",
  FEEDING: "🐟", EQUIPMENT_CHECK: "⚙️", CUSTOM: "📋",
};

export function MaintenanceTaskRow({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  const [completing, setCompleting] = useState(false);
  const isOverdue = new Date(task.nextDue) < new Date();

  async function handleComplete() {
    setCompleting(true);
    await fetch(`/api/maintenance/${task.id}/complete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    onComplete(task.id);
    setCompleting(false);
  }

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${isOverdue ? "border-red-200 bg-red-50" : "border-gray-200"}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg">{CATEGORY_ICONS[task.category] ?? "📋"}</span>
        <div>
          <p className="text-sm font-medium text-ocean-900">{task.title}</p>
          <p className="text-xs text-gray-500">{task.tank.name} &middot; Every {task.frequencyDays} days</p>
          {task.description && <p className="mt-1 text-xs text-gray-400">{task.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
          {isOverdue ? "Overdue" : `Due ${new Date(task.nextDue).toLocaleDateString()}`}
        </span>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50"
        >
          {completing ? "..." : "Done"}
        </button>
      </div>
    </div>
  );
}
