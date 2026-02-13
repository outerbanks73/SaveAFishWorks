"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlugPicker } from "./SlugPicker";
import { FaqEditor } from "./FaqEditor";
import { DynamicListInput } from "./DynamicListInput";
import { generateSlug } from "@/lib/utils/slug";

interface GlossaryFormData {
  id?: string;
  slug: string;
  term: string;
  definition: string;
  longDescription: string;
  category: string;
  status: string;
  relatedTerms: string[];
  relatedGuides: string[];
  relatedFish: string[];
  faqs: { question: string; answer: string }[];
}

const EMPTY: GlossaryFormData = {
  slug: "", term: "", definition: "", longDescription: "", category: "",
  status: "DRAFT", relatedTerms: [], relatedGuides: [], relatedFish: [], faqs: [],
};

export function GlossaryForm({ initial }: { initial?: GlossaryFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<GlossaryFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?.id;

  function set<K extends keyof GlossaryFormData>(key: K, value: GlossaryFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "term" && !isEdit) next.slug = generateSlug(value as string);
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/glossary/${initial!.id}` : "/api/admin/glossary";
    try {
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); return; }
      router.push("/admin/glossary"); router.refresh();
    } catch { setError("Network error"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Term</label>
            <input type="text" value={form.term} onChange={(e) => set("term", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Definition</label>
            <textarea value={form.definition} onChange={(e) => set("definition", e.target.value)} rows={3} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Long Description</label>
            <textarea value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} rows={6} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none">
              <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Category</label>
            <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <DynamicListInput label="Related Terms" values={form.relatedTerms} onChange={(v) => set("relatedTerms", v)} placeholder="Term slug..." />
          <SlugPicker label="Related Guides" endpoint="/api/admin/guides/slugs" selected={form.relatedGuides} onChange={(v) => set("relatedGuides", v)} />
          <SlugPicker label="Related Fish" endpoint="/api/admin/fish/slugs" selected={form.relatedFish} onChange={(v) => set("relatedFish", v)} />
          <FaqEditor faqs={form.faqs} onChange={(v) => set("faqs", v)} />
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">{saving ? "Saving..." : isEdit ? "Update Term" : "Create Term"}</button>
        <button type="button" onClick={() => router.push("/admin/glossary")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
