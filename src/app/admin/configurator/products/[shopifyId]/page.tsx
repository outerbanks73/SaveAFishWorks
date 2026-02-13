"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Override {
  shopifyProductId: string;
  categoryOverride: string;
  isHidden: boolean;
  sortOrder: number | null;
  notes: string;
}

export default function EditShopifyOverridePage() {
  const router = useRouter();
  const params = useParams();
  const shopifyId = params.shopifyId as string;

  const [form, setForm] = useState<Override>({
    shopifyProductId: shopifyId,
    categoryOverride: "",
    isHidden: false,
    sortOrder: null,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/configurator/products/${encodeURIComponent(shopifyId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.override) {
          setForm({
            shopifyProductId: shopifyId,
            categoryOverride: data.override.categoryOverride ?? "",
            isHidden: data.override.isHidden ?? false,
            sortOrder: data.override.sortOrder,
            notes: data.override.notes ?? "",
          });
        }
        setLoading(false);
      });
  }, [shopifyId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/configurator/products/${encodeURIComponent(shopifyId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/configurator/products");
    router.refresh();
  }

  if (loading) return <p className="py-8 text-center text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Product Override</h1>
      <p className="mb-4 text-sm text-gray-500">Shopify ID: {shopifyId}</p>
      <form onSubmit={save} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Category Override</label>
          <input type="text" value={form.categoryOverride} onChange={(e) => setForm({ ...form, categoryOverride: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" placeholder="Leave empty for original" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isHidden} onChange={(e) => setForm({ ...form, isHidden: e.target.checked })} className="rounded" />
          <label className="text-sm font-medium text-ocean-900">Hidden from configurator</label>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Sort Order</label>
          <input type="number" value={form.sortOrder ?? ""} onChange={(e) => setForm({ ...form, sortOrder: e.target.value ? parseInt(e.target.value) : null })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Override"}
          </button>
          <button type="button" onClick={() => router.push("/admin/configurator/products")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
