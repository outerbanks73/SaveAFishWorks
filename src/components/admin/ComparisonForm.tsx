"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlugPicker } from "./SlugPicker";
import { FaqEditor } from "./FaqEditor";
import { DynamicListInput } from "./DynamicListInput";
import { generateSlug } from "@/lib/utils/slug";

interface ComparisonFormData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  optionA: { name: string; description: string; image: string; pros: string[]; cons: string[] };
  optionB: { name: string; description: string; image: string; pros: string[]; cons: string[] };
  criteria: { name: string; optionAValue: string; optionBValue: string; winner: string }[];
  verdict: string;
  status: string;
  relatedComparisons: string[];
  relatedGuides: string[];
  faqs: { question: string; answer: string }[];
}

const EMPTY_OPTION = { name: "", description: "", image: "", pros: [], cons: [] };
const EMPTY: ComparisonFormData = {
  slug: "", title: "", description: "", image: "", optionA: { ...EMPTY_OPTION },
  optionB: { ...EMPTY_OPTION }, criteria: [], verdict: "", status: "DRAFT",
  relatedComparisons: [], relatedGuides: [], faqs: [],
};

export function ComparisonForm({ initial }: { initial?: ComparisonFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<ComparisonFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?.id;

  function set<K extends keyof ComparisonFormData>(key: K, value: ComparisonFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEdit) next.slug = generateSlug(value as string);
      return next;
    });
  }

  function setOption(side: "optionA" | "optionB", field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  }

  function addCriterion() {
    setForm((prev) => ({ ...prev, criteria: [...prev.criteria, { name: "", optionAValue: "", optionBValue: "", winner: "tie" }] }));
  }

  function updateCriterion(i: number, field: string, value: string) {
    const updated = [...form.criteria];
    updated[i] = { ...updated[i], [field]: value };
    setForm((prev) => ({ ...prev, criteria: updated }));
  }

  function removeCriterion(i: number) {
    setForm((prev) => ({ ...prev, criteria: prev.criteria.filter((_, idx) => idx !== i) }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/comparisons/${initial!.id}` : "/api/admin/comparisons";
    try {
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); return; }
      router.push("/admin/comparisons"); router.refresh();
    } catch { setError("Network error"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Title</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" /></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Slug</label><input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-aqua-500 focus:outline-none" /></div>
        </div>
        <div><label className="mb-1 block text-sm font-medium text-ocean-900">Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></div>
          <div><label className="mb-1 block text-sm font-medium text-ocean-900">Image URL</label><input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>
        </div>

        {/* Option A & B */}
        {(["optionA", "optionB"] as const).map((side) => (
          <fieldset key={side} className="rounded-lg border border-gray-200 p-4">
            <legend className="px-2 text-sm font-semibold text-ocean-900">{side === "optionA" ? "Option A" : "Option B"}</legend>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="mb-1 block text-xs font-medium">Name</label><input type="text" value={form[side].name} onChange={(e) => setOption(side, "name", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" /></div>
                <div><label className="mb-1 block text-xs font-medium">Image</label><input type="text" value={form[side].image} onChange={(e) => setOption(side, "image", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" /></div>
              </div>
              <div><label className="mb-1 block text-xs font-medium">Description</label><textarea value={form[side].description} onChange={(e) => setOption(side, "description", e.target.value)} rows={2} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" /></div>
              <DynamicListInput label="Pros" values={form[side].pros} onChange={(v) => setOption(side, "pros", v)} />
              <DynamicListInput label="Cons" values={form[side].cons} onChange={(v) => setOption(side, "cons", v)} />
            </div>
          </fieldset>
        ))}

        {/* Criteria */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ocean-900">Criteria</label>
          {form.criteria.map((c, i) => (
            <div key={i} className="mb-2 grid grid-cols-5 gap-2">
              <input type="text" value={c.name} onChange={(e) => updateCriterion(i, "name", e.target.value)} placeholder="Name" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
              <input type="text" value={c.optionAValue} onChange={(e) => updateCriterion(i, "optionAValue", e.target.value)} placeholder="A value" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
              <input type="text" value={c.optionBValue} onChange={(e) => updateCriterion(i, "optionBValue", e.target.value)} placeholder="B value" className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none" />
              <select value={c.winner} onChange={(e) => updateCriterion(i, "winner", e.target.value)} className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-aqua-500 focus:outline-none"><option value="a">A</option><option value="b">B</option><option value="tie">Tie</option></select>
              <button type="button" onClick={() => removeCriterion(i)} className="text-sm text-red-400 hover:text-red-600">&times;</button>
            </div>
          ))}
          <button type="button" onClick={addCriterion} className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-ocean-900 hover:bg-gray-200">Add Criterion</button>
        </div>

        <div><label className="mb-1 block text-sm font-medium text-ocean-900">Verdict</label><textarea value={form.verdict} onChange={(e) => set("verdict", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" /></div>

        <DynamicListInput label="Related Comparisons" values={form.relatedComparisons} onChange={(v) => set("relatedComparisons", v)} placeholder="Comparison slug..." />
        <SlugPicker label="Related Guides" endpoint="/api/admin/guides/slugs" selected={form.relatedGuides} onChange={(v) => set("relatedGuides", v)} />
        <FaqEditor faqs={form.faqs} onChange={(v) => set("faqs", v)} />
      </div>

      <div className="mt-8 flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">{saving ? "Saving..." : isEdit ? "Update Comparison" : "Create Comparison"}</button>
        <button type="button" onClick={() => router.push("/admin/comparisons")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
