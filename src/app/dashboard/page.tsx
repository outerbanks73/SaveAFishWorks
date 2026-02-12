import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const [configs, tanks, upcomingTasks] = await Promise.all([
    prisma.savedConfiguration.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.tank.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { livestock: true, plants: true } } },
    }),
    prisma.maintenanceTask.findMany({
      where: { userId: session.user.id, nextDue: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } },
      orderBy: { nextDue: "asc" },
      take: 10,
      include: { tank: { select: { name: true } } },
    }),
  ]);

  const overdue = upcomingTasks.filter((t) => t.nextDue < new Date());
  const dueToday = upcomingTasks.filter((t) => {
    const today = new Date();
    return t.nextDue >= new Date(today.setHours(0, 0, 0, 0)) && t.nextDue <= new Date(today.setHours(23, 59, 59, 999));
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">
        Welcome back, {session.user.name?.split(" ")[0] ?? "there"}
      </h1>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Saved Configs" value={configs.length} href="/dashboard/configurations" />
        <StatCard label="Tanks" value={tanks.length} href="/dashboard/tanks" />
        <StatCard label="Overdue Tasks" value={overdue.length} href="/dashboard/maintenance" variant={overdue.length > 0 ? "danger" : "default"} />
        <StatCard label="Due Soon" value={dueToday.length} href="/dashboard/maintenance" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent configs */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ocean-900">Saved Configurations</h2>
            <Link href="/dashboard/configurations" className="text-sm text-aqua-600 hover:text-aqua-700">View all</Link>
          </div>
          {configs.length === 0 ? (
            <EmptyState message="No saved configurations yet." action={{ label: "Open Configurator", href: "/configurator" }} />
          ) : (
            <div className="space-y-2">
              {configs.map((c) => (
                <div key={c.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-ocean-900">{c.name}</p>
                  <p className="text-xs text-gray-500">Updated {new Date(c.updatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tanks */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ocean-900">Your Tanks</h2>
            <Link href="/dashboard/tanks" className="text-sm text-aqua-600 hover:text-aqua-700">View all</Link>
          </div>
          {tanks.length === 0 ? (
            <EmptyState message="No tanks added yet." action={{ label: "Add Tank", href: "/dashboard/tanks/new" }} />
          ) : (
            <div className="space-y-2">
              {tanks.map((t) => (
                <Link key={t.id} href={`/dashboard/tanks/${t.id}`} className="block rounded-lg border border-gray-200 p-3 transition hover:border-aqua-300">
                  <p className="font-medium text-ocean-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.gallons}G &middot; {t._count.livestock} fish &middot; {t._count.plants} plants</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upcoming maintenance */}
      {upcomingTasks.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-ocean-900">Upcoming Maintenance</h2>
          <div className="space-y-2">
            {upcomingTasks.map((t) => (
              <div key={t.id} className={`rounded-lg border p-3 ${t.nextDue < new Date() ? "border-red-200 bg-red-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ocean-900">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.tank.name}</p>
                  </div>
                  <span className={`text-xs font-medium ${t.nextDue < new Date() ? "text-red-600" : "text-gray-500"}`}>
                    {t.nextDue < new Date() ? "Overdue" : `Due ${new Date(t.nextDue).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, href, variant = "default" }: { label: string; value: number; href: string; variant?: "default" | "danger" }) {
  return (
    <Link href={href} className="rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-sm">
      <p className={`text-2xl font-bold ${variant === "danger" && value > 0 ? "text-red-600" : "text-ocean-900"}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </Link>
  );
}

function EmptyState({ message, action }: { message: string; action: { label: string; href: string } }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
      <p className="mb-3 text-sm text-gray-400">{message}</p>
      <Link href={action.href} className="text-sm font-medium text-aqua-600 hover:text-aqua-700">{action.label} &rarr;</Link>
    </div>
  );
}
