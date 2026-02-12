import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LivestockManager } from "@/components/dashboard/LivestockManager";
import { PlantManager } from "@/components/dashboard/PlantManager";
import { EquipmentManager } from "@/components/dashboard/EquipmentManager";

const TANK_TYPE_LABELS: Record<string, string> = {
  LOW_TECH: "Low Tech",
  HIGH_TECH: "High Tech",
  NANO: "Nano",
};

export default async function TankDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return null;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({
    where: { id, userId: session.user.id },
    include: { livestock: true, plants: true, equipment: true },
  });

  if (!tank) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ocean-900">{tank.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {tank.gallons}G &middot; {TANK_TYPE_LABELS[tank.tankType] ?? tank.tankType}
            {tank.hasCO2 && " &middot; CO2"}
            {tank.filterType && ` &middot; ${tank.filterType} filter`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/tanks/${id}/water-logs`} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">
            Water Logs
          </Link>
          <Link href={`/dashboard/tanks/${id}/dosing`} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">
            Dosing
          </Link>
          <Link href={`/dashboard/tanks/${id}/edit`} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50">
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <LivestockManager tankId={id} initialLivestock={tank.livestock} />
        <PlantManager tankId={id} initialPlants={tank.plants} />
        <EquipmentManager tankId={id} initialEquipment={tank.equipment} />
      </div>
    </div>
  );
}
