import type { FishSpecies } from "@/types";

interface FishSpecsTableProps {
  fish: FishSpecies;
}

const SPECS: { label: string; key: keyof FishSpecies }[] = [
  { label: "Scientific Name", key: "scientificName" },
  { label: "Family", key: "family" },
  { label: "Origin", key: "origin" },
  { label: "Adult Size", key: "size" },
  { label: "Lifespan", key: "lifespan" },
  { label: "Min Tank Size", key: "tankSize" },
  { label: "Temperature", key: "temperature" },
  { label: "pH", key: "ph" },
  { label: "Water Hardness", key: "hardness" },
  { label: "Diet", key: "diet" },
  { label: "Temperament", key: "temperament" },
];

export function FishSpecsTable({ fish }: FishSpecsTableProps) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {SPECS.map((spec) => (
          <tr key={spec.key} className="border-b border-gray-100">
            <td className="py-2 pr-4 font-medium text-gray-600">
              {spec.label}
            </td>
            <td className="py-2 text-ocean-900">
              {String(fish[spec.key])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
