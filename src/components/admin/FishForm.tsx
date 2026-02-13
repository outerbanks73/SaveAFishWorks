"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlugPicker } from "./SlugPicker";
import { FaqEditor } from "./FaqEditor";
import { DynamicListInput } from "./DynamicListInput";
import { generateSlug } from "@/lib/utils/slug";

interface FishFormData {
  id?: string;
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  origin: string;
  description: string;
  image: string;
  difficulty: string;
  temperament: string;
  diet: string;
  lifespan: string;
  size: string;
  tankSize: string;
  temperature: string;
  ph: string;
  hardness: string;
  waterType: string;
  careNotes: string;
  status: string;
  compatibleWith: string[];
  incompatibleWith: string[];
  relatedGuides: string[];
  relatedProducts: string[];
  faqs: { question: string; answer: string }[];
}

const EMPTY: FishFormData = {
  slug: "", commonName: "", scientificName: "", family: "", origin: "",
  description: "", image: "", difficulty: "beginner", temperament: "",
  diet: "", lifespan: "", size: "", tankSize: "", temperature: "", ph: "",
  hardness: "", waterType: "freshwater", careNotes: "", status: "DRAFT",
  compatibleWith: [], incompatibleWith: [], relatedGuides: [], relatedProducts: [],
  faqs: [],
};

export function FishForm({ initial }: { initial?: FishFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<FishFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initial?.id;

  function set<K extends keyof FishFormData>(key: K, value: FishFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "commonName" && !isEdit) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/fish/${initial!.id}` : "/api/admin/fish";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); return; }
      router.push("/admin/fish");
      router.refresh();
    } catch { setError("Network error"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-900">Common Name</label>
              <input type="text" value={form.commonName} onChange={(e) => set("commonName", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-900">Scientific Name</label>
              <input type="text" value={form.scientificName} onChange={(e) => set("scientificName", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-aqua-500 focus:outline-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-900">Family</label>
              <input type="text" value={form.family} onChange={(e) => set("family", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-900">Origin</label>
              <input type="text" value={form.origin} onChange={(e) => set("origin", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Care Notes</label>
            <textarea value={form.careNotes} onChange={(e) => set("careNotes", e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <DynamicListInput label="Compatible With" values={form.compatibleWith} onChange={(v) => set("compatibleWith", v)} placeholder="Species name..." />
          <DynamicListInput label="Incompatible With" values={form.incompatibleWith} onChange={(v) => set("incompatibleWith", v)} placeholder="Species name..." />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Water Type</label>
            <select value={form.waterType} onChange={(e) => set("waterType", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="freshwater">Freshwater</option>
              <option value="saltwater">Saltwater</option>
              <option value="brackish">Brackish</option>
            </select>
          </div>
          {(["temperament", "diet", "lifespan", "size", "tankSize", "temperature", "ph", "hardness", "image"] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize text-ocean-900">{field === "ph" ? "pH" : field === "tankSize" ? "Tank Size" : field}</label>
              <input type="text" value={form[field]} onChange={(e) => set(field, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
            </div>
          ))}
          <SlugPicker label="Related Guides" endpoint="/api/admin/guides/slugs" selected={form.relatedGuides} onChange={(v) => set("relatedGuides", v)} />
          <SlugPicker label="Related Products" endpoint="/api/admin/content-products/slugs" selected={form.relatedProducts} onChange={(v) => set("relatedProducts", v)} />
          <FaqEditor faqs={form.faqs} onChange={(v) => set("faqs", v)} />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Update Fish" : "Create Fish"}
        </button>
        <button type="button" onClick={() => router.push("/admin/fish")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
