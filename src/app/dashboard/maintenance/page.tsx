"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/maintenance");
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  function handleComplete(taskId: string) {
    // Refetch to get updated nextDue
    fetchTasks();
  }

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  const now = new Date();
  const overdue = tasks.filter((t) => new Date(t.nextDue) < now);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const dueToday = tasks.filter((t) => { const d = new Date(t.nextDue); return d >= now && d <= todayEnd; });
  const upcoming = tasks.filter((t) => new Date(t.nextDue) > todayEnd);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Maintenance</h1>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-400">
          No maintenance tasks. Add a tank to auto-generate a schedule.
        </div>
      ) : (
        <div className="space-y-8">
          {overdue.length > 0 && (
            <Section title={`Overdue (${overdue.length})`} tasks={overdue} onComplete={handleComplete} />
          )}
          {dueToday.length > 0 && (
            <Section title={`Due Today (${dueToday.length})`} tasks={dueToday} onComplete={handleComplete} />
          )}
          {upcoming.length > 0 && (
            <Section title={`Upcoming (${upcoming.length})`} tasks={upcoming} onComplete={handleComplete} />
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, tasks, onComplete }: { title: string; tasks: Task[]; onComplete: (id: string) => void }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-ocean-900">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <MaintenanceTaskRow key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
}
