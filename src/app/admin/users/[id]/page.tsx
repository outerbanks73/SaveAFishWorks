import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tanks: { include: { _count: { select: { livestock: true, plants: true } } } },
      savedConfigurations: { orderBy: { updatedAt: "desc" }, take: 10 },
      _count: { select: { notifications: true, maintenanceTasks: true } },
    },
  });

  if (!user) notFound();

  return (
    <div>
      <Link href="/admin/users" className="mb-4 inline-block text-sm text-aqua-600 hover:text-aqua-700">&larr; Back to users</Link>
      <h1 className="mb-2 text-2xl font-bold text-ocean-900">{user.name ?? "Unnamed User"}</h1>
      <p className="mb-6 text-sm text-gray-500">{user.email} &middot; {user.role} &middot; Joined {user.createdAt.toLocaleDateString()}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-ocean-900">{user.tanks.length}</p>
          <p className="text-sm text-gray-500">Tanks</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-ocean-900">{user.savedConfigurations.length}</p>
          <p className="text-sm text-gray-500">Configurations</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-ocean-900">{user._count.maintenanceTasks}</p>
          <p className="text-sm text-gray-500">Maintenance Tasks</p>
        </div>
      </div>

      {user.tanks.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-ocean-900">Tanks</h2>
          <div className="space-y-2">
            {user.tanks.map((tank) => (
              <div key={tank.id} className="rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-ocean-900">{tank.name} — {tank.gallons}G</p>
                <p className="text-xs text-gray-500">{tank._count.livestock} fish &middot; {tank._count.plants} plants</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
