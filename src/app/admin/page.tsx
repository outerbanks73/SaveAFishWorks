import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/admin/StatsCard";

export default async function AdminDashboard() {
  const [userCount, tankCount, productCount, overdueTasks] = await Promise.all([
    prisma.user.count(),
    prisma.tank.count(),
    prisma.adminProduct.count(),
    prisma.maintenanceTask.count({ where: { nextDue: { lt: new Date() } } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Users" value={userCount} icon="👥" />
        <StatsCard label="Total Tanks" value={tankCount} icon="🐠" />
        <StatsCard label="Products" value={productCount} icon="📦" />
        <StatsCard label="Overdue Tasks" value={overdueTasks} icon="⚠️" />
      </div>
    </div>
  );
}
