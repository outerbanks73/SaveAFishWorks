"use client";

import { useState } from "react";

interface ProductFormProps {
  initialData?: {
    title: string;
    category: string;
    price: number;
    imageUrl?: string | null;
    shopifyProductId?: string | null;
    isActive: boolean;
    metadata?: Record<string, unknown> | null;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [shopifyId, setShopifyId] = useState(initialData?.shopifyProductId ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      title,
      category,
      price: Number(price),
      imageUrl: imageUrl || null,
      shopifyProductId: shopifyId || null,
      isActive,
    });
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ocean-900">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. substrate, lighting" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean-900">Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} step="0.01" min="0" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ocean-900">Image URL</label>
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ocean-900">Shopify Product ID (optional)</label>
        <input type="text" value={shopifyId} onChange={(e) => setShopifyId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="active" className="text-sm font-medium text-ocean-900">Active</label>
      </div>
      <button type="submit" disabled={submitting} className="rounded-lg bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-aqua-700 disabled:opacity-50">
        {submitting ? "Saving..." : initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
