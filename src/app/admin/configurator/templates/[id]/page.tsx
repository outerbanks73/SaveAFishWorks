"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DynamicListInput } from "@/components/admin/DynamicListInput";

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    templateId: "", name: "", description: "", style: "nature", tankId: "",
    difficulty: "beginner", shopifyProductIds: [] as string[], isActive: true, sortOrder: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/configurator/templates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          templateId: data.templateId, name: data.name, description: data.description,
          style: data.style, tankId: data.tankId, difficulty: data.difficulty,
          shopifyProductIds: data.shopifyProductIds, isActive: data.isActive, sortOrder: data.sortOrder,
        });
        setLoading(false);
      });
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/configurator/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/configurator/templates");
    router.refresh();
  }

  if (loading) return <p className="py-8 text-center text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Template</h1>
      <form onSubmit={save} className="max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Template ID</label>
            <input type="text" value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Style</label>
            <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="nature">Nature</option>
              <option value="iwagumi">Iwagumi</option>
              <option value="dutch">Dutch</option>
              <option value="biotope">Biotope</option>
              <option value="paludarium">Paludarium</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Tank ID</label>
            <input type="text" value={form.tankId} onChange={(e) => setForm({ ...form, tankId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <DynamicListInput label="Shopify Product IDs" values={form.shopifyProductIds} onChange={(v) => setForm({ ...form, shopifyProductIds: v })} placeholder="Product ID..." />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
          <label className="text-sm font-medium text-ocean-900">Active</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
            {saving ? "Saving..." : "Update Template"}
          </button>
          <button type="button" onClick={() => router.push("/admin/configurator/templates")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
