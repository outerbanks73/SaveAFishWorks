import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FishForm } from "@/components/admin/FishForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFishPage({ params }: Props) {
  const { id } = await params;
  const fish = await prisma.fishSpecies.findUnique({ where: { id } });
  if (!fish) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Fish Species</h1>
      <FishForm
        initial={{
          id: fish.id, slug: fish.slug, commonName: fish.commonName,
          scientificName: fish.scientificName, family: fish.family, origin: fish.origin,
          description: fish.description, image: fish.image ?? "", difficulty: fish.difficulty,
          temperament: fish.temperament, diet: fish.diet, lifespan: fish.lifespan,
          size: fish.size, tankSize: fish.tankSize, temperature: fish.temperature,
          ph: fish.ph, hardness: fish.hardness, waterType: fish.waterType,
          careNotes: fish.careNotes, status: fish.status,
          compatibleWith: fish.compatibleWith, incompatibleWith: fish.incompatibleWith,
          relatedGuides: fish.relatedGuides, relatedProducts: fish.relatedProducts,
          faqs: (fish.faqs as { question: string; answer: string }[]) ?? [],
        }}
      />
    </div>
  );
}
