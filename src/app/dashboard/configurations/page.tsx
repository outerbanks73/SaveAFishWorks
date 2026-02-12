"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedConfig {
  id: string;
  name: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  tank?: { id: string; name: string } | null;
}

export default function ConfigurationsPage() {
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/configurations")
      .then((r) => r.json())
      .then((d) => setConfigs(d.configurations ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this configuration?")) return;
    await fetch(`/api/configurations/${id}`, { method: "DELETE" });
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <div className="animate-pulse text-gray-400">Loading configurations...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ocean-900">Saved Configurations</h1>
        <Link href="/configurator" className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700">
          New Configuration
        </Link>
      </div>

      {configs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
          <p className="mb-3 text-gray-400">No saved configurations yet.</p>
          <Link href="/configurator" className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
            Open Configurator &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((config) => {
            const data = config.data as { items?: unknown[]; tank?: { label?: string }; style?: string };
            return (
              <div key={config.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-ocean-900">{config.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {data.tank?.label ?? "No tank"} &middot; {data.style ?? "nature"} style &middot;{" "}
                      {(data.items as unknown[])?.length ?? 0} items
                    </p>
                    {config.tank && (
                      <p className="mt-0.5 text-xs text-aqua-600">Linked to: {config.tank.name}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Updated {new Date(config.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/configurator?load=${config.id}`}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-ocean-900 hover:bg-gray-50"
                    >
                      Load
                    </Link>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
