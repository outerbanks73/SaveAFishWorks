import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminFishPage() {
  const fish = await prisma.fishSpecies.findMany({
    orderBy: { commonName: "asc" },
    select: { id: true, commonName: true, scientificName: true, waterType: true, difficulty: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <AdminPageHeader title="Fish Species" count={fish.length} addHref="/admin/fish/new" addLabel="New Fish" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Common Name</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Scientific Name</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Water</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Difficulty</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fish.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{f.commonName}</td>
                <td className="px-4 py-3 italic text-gray-500">{f.scientificName}</td>
                <td className="px-4 py-3 text-gray-600">{f.waterType}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{f.difficulty}</td>
                <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/fish/${f.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {fish.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No fish species yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
