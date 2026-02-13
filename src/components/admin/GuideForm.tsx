"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlugPicker } from "./SlugPicker";
import { FaqEditor } from "./FaqEditor";
import { generateSlug } from "@/lib/utils/slug";

interface GuideFormData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  bodyMarkdown: string;
  readingTime: string;
  image: string;
  status: string;
  relatedGuides: string[];
  relatedFish: string[];
  relatedProducts: string[];
  relatedGlossaryTerms: string[];
  faqs: { question: string; answer: string }[];
}

const EMPTY: GuideFormData = {
  slug: "",
  title: "",
  description: "",
  category: "care",
  author: "",
  bodyMarkdown: "",
  readingTime: "5 min read",
  image: "",
  status: "DRAFT",
  relatedGuides: [],
  relatedFish: [],
  relatedProducts: [],
  relatedGlossaryTerms: [],
  faqs: [],
};

export function GuideForm({ initial }: { initial?: GuideFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<GuideFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initial?.id;

  function set<K extends keyof GuideFormData>(key: K, value: GuideFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEdit) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/guides/${initial!.id}` : "/api/admin/guides";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
        return;
      }
      router.push("/admin/guides");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save}>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Title</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Body (Markdown)</label>
            <textarea value={form.bodyMarkdown} onChange={(e) => set("bodyMarkdown", e.target.value)} rows={20} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
        </div>

        {/* Right column */}
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
            <label className="mb-1 block text-sm font-medium text-ocean-900">Category</label>
            <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Author</label>
            <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Reading Time</label>
            <input type="text" value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" placeholder="5 min read" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean-900">Image URL</label>
            <input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none" />
          </div>
          <SlugPicker label="Related Guides" endpoint="/api/admin/guides/slugs" selected={form.relatedGuides} onChange={(v) => set("relatedGuides", v)} />
          <SlugPicker label="Related Fish" endpoint="/api/admin/fish/slugs" selected={form.relatedFish} onChange={(v) => set("relatedFish", v)} />
          <SlugPicker label="Related Products" endpoint="/api/admin/content-products/slugs" selected={form.relatedProducts} onChange={(v) => set("relatedProducts", v)} />
          <SlugPicker label="Related Glossary" endpoint="/api/admin/glossary/slugs" selected={form.relatedGlossaryTerms} onChange={(v) => set("relatedGlossaryTerms", v)} />
          <FaqEditor faqs={form.faqs} onChange={(v) => set("faqs", v)} />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-aqua-600 px-6 py-2 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Update Guide" : "Create Guide"}
        </button>
        <button type="button" onClick={() => router.push("/admin/guides")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
