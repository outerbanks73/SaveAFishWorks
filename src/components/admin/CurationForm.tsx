"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlugPicker } from "./SlugPicker";
import { FaqEditor } from "./FaqEditor";
import { DynamicListInput } from "./DynamicListInput";
import { generateSlug } from "@/lib/utils/slug";

interface CurationItem {
  productSlug: string;
  rank: number;
  verdict: string;
  bestFor: string;
}

interface CurationFormData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  items: CurationItem[];
  status: string;
  relatedLists: string[];
  relatedGuides: string[];
  targetPersonas: string[];
  faqs: { question: string; answer: string }[];
}

const EMPTY: CurationFormData = {
  slug: "", title: "", description: "", intro: "", image: "", items: [],
  status: "DRAFT", relatedLists: [], relatedGuides: [], targetPersonas: [], faqs: [],
};

export function CurationForm({ initial }: { initial?: CurationFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<CurationFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?.id;

  function set<K extends keyof CurationFormData>(key: K, value: CurationFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEdit) next.slug = generateSlug(value as string);
      return next;
    });
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { productSlug: "", rank: prev.items.length + 1, verdict: "", bestFor: "" }] }));
  }

  function updateItem(i: number, field: keyof CurationItem, value: string | number) {
    const updated = [...form.items];
    updated[i] = { ...updated[i], [field]: value };
    setForm((prev) => ({ ...prev, items: updated }));
  }

  function removeItem(i: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/curation/${initial!.id}` : "/api/admin/curation";
    try {
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); return; }
      router.push("/admin/curation"); router.refresh();
    } catch { setError("Network error"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Title</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" /></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Slug</label><input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-aqua-500 focus:outline-none" /></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Intro</label><textarea value={form.intro} onChange={(e) => set("intro", e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ocean-900">Items</label>
            {form.items.map((item, i) => (
              <div key={i} className="mb-2 grid grid-cols-5 gap-2">
                <input type="number" value={item.rank} onChange={(e) => updateItem(i, "rank", parseInt(e.target.value) || 0)} placeholder="#" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
                <input type="text" value={item.productSlug} onChange={(e) => updateItem(i, "productSlug", e.target.value)} placeholder="Product slug" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
                <input type="text" value={item.verdict} onChange={(e) => updateItem(i, "verdict", e.target.value)} placeholder="Verdict" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
                <input type="text" value={item.bestFor} onChange={(e) => updateItem(i, "bestFor", e.target.value)} placeholder="Best for" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
                <button type="button" onClick={() => removeItem(i)} className="text-sm text-red-400 hover:text-red-600">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-ocean-900 hover:bg-gray-200">Add Item</button>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Image URL</label><input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>
          <DynamicListInput label="Related Lists" values={form.relatedLists} onChange={(v) => set("relatedLists", v)} placeholder="List slug..." />
          <SlugPicker label="Related Guides" endpoint="/api/admin/guides/slugs" selected={form.relatedGuides} onChange={(v) => set("relatedGuides", v)} />
          <DynamicListInput label="Target Personas" values={form.targetPersonas} onChange={(v) => set("targetPersonas", v)} placeholder="Persona slug..." />
          <FaqEditor faqs={form.faqs} onChange={(v) => set("faqs", v)} />
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">{saving ? "Saving..." : isEdit ? "Update List" : "Create List"}</button>
        <button type="button" onClick={() => router.push("/admin/curation")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
