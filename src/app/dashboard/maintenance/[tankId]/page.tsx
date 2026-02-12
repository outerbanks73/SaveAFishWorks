"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { MaintenanceTaskRow } from "@/components/dashboard/MaintenanceTaskRow";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  frequencyDays: number;
  nextDue: string;
  lastCompleted?: string | null;
  tank: { id: string; name: string };
}

export default function TankMaintenancePage() {
  const params = useParams();
  const tankId = params.tankId as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tankName, setTankName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/maintenance?tankId=${tankId}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
      if (data.tasks.length > 0) setTankName(data.tasks[0].tank.name);
    }
    setLoading(false);
  }, [tankId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Maintenance — {tankName || "Tank"}</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-400">No maintenance tasks for this tank.</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <MaintenanceTaskRow key={task.id} task={task} onComplete={() => fetchTasks()} />
          ))}
        </div>
      )}
    </div>
  );
}
