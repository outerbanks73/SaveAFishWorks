import Link from "next/link";

interface TankCardProps {
  tank: {
    id: string;
    name: string;
    gallons: number;
    tankType: string;
    hasCO2: boolean;
    _count: { livestock: number; plants: number; equipment: number; maintenanceTasks: number };
  };
}

const TANK_TYPE_LABELS: Record<string, string> = {
  LOW_TECH: "Low Tech",
  HIGH_TECH: "High Tech",
  NANO: "Nano",
};

export function TankCard({ tank }: TankCardProps) {
  return (
    <Link
      href={`/dashboard/tanks/${tank.id}`}
      className="block rounded-lg border border-gray-200 p-5 transition hover:border-aqua-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-ocean-900">{tank.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {tank.gallons}G &middot; {TANK_TYPE_LABELS[tank.tankType] ?? tank.tankType}
            {tank.hasCO2 && " &middot; CO2"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>{tank._count.livestock} fish</span>
        <span>{tank._count.plants} plants</span>
        <span>{tank._count.equipment} equipment</span>
        <span>{tank._count.maintenanceTasks} tasks</span>
      </div>
    </Link>
  );
}
