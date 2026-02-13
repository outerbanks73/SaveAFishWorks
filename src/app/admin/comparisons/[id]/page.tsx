import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ComparisonForm } from "@/components/admin/ComparisonForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditComparisonPage({ params }: Props) {
  const { id } = await params;
  const comp = await prisma.comparison.findUnique({ where: { id } });
  if (!comp) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Comparison</h1>
      <ComparisonForm
        initial={{
          id: comp.id,
          slug: comp.slug,
          title: comp.title,
          description: comp.description,
          image: comp.image ?? "",
          optionA: comp.optionA as { name: string; description: string; image: string; pros: string[]; cons: string[] },
          optionB: comp.optionB as { name: string; description: string; image: string; pros: string[]; cons: string[] },
          criteria: comp.criteria as { name: string; optionAValue: string; optionBValue: string; winner: string }[],
          verdict: comp.verdict,
          status: comp.status,
          relatedComparisons: comp.relatedComparisons,
          relatedGuides: comp.relatedGuides,
          faqs: (comp.faqs as { question: string; answer: string }[]) ?? [],
        }}
      />
    </div>
  );
}
