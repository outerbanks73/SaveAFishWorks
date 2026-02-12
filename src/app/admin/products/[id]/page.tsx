"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`).then((r) => r.json()).then((d) => setProduct(d.product));
  }, [id]);

  if (!product) return <div className="animate-pulse text-gray-400">Loading...</div>;

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/products");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Product</h1>
      <ProductForm
        initialData={product as Parameters<typeof ProductForm>[0]["initialData"]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
