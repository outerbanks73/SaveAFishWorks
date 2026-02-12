"use client";

import { TankForm } from "@/components/dashboard/TankForm";
import { useRouter } from "next/navigation";

export default function NewTankPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/tanks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { tank } = await res.json();
      // Generate maintenance schedule
      await fetch(`/api/tanks/${tank.id}/generate-schedule`, { method: "POST" });
      router.push(`/dashboard/tanks/${tank.id}`);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Add New Tank</h1>
      <TankForm onSubmit={handleSubmit} />
    </div>
  );
}
