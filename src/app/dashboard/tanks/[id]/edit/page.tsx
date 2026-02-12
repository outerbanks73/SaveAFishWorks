"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TankForm } from "@/components/dashboard/TankForm";

export default function EditTankPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [tank, setTank] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/tanks/${id}`).then((r) => r.json()).then((d) => setTank(d.tank));
  }, [id]);

  if (!tank) return <div className="animate-pulse text-gray-400">Loading...</div>;

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/tanks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push(`/dashboard/tanks/${id}`);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Tank</h1>
      <TankForm
        initialData={tank as Parameters<typeof TankForm>[0]["initialData"]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
