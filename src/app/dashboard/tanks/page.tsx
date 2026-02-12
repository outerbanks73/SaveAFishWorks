import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { TankCard } from "@/components/dashboard/TankCard";

export default async function TanksPage() {
  const session = await auth();
  if (!session) return null;

  const tanks = await prisma.tank.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { livestock: true, plants: true, equipment: true, maintenanceTasks: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ocean-900">Your Tanks</h1>
        <Link
          href="/dashboard/tanks/new"
          className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700"
        >
          Add Tank
        </Link>
      </div>

      {tanks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
          <p className="mb-3 text-gray-400">No tanks added yet.</p>
          <Link href="/dashboard/tanks/new" className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
            Add your first tank &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tanks.map((tank) => (
            <TankCard key={tank.id} tank={tank} />
          ))}
        </div>
      )}
    </div>
  );
}
