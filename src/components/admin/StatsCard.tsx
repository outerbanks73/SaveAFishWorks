interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  change?: string;
}

export function StatsCard({ label, value, icon, change }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {change && <span className="text-xs font-medium text-green-600">{change}</span>}
      </div>
      <p className="mt-3 text-2xl font-bold text-ocean-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
