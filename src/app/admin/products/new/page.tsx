"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/products");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
