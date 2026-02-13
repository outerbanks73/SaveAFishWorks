import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GlossaryForm } from "@/components/admin/GlossaryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGlossaryPage({ params }: Props) {
  const { id } = await params;
  const term = await prisma.glossaryTerm.findUnique({ where: { id } });
  if (!term) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Glossary Term</h1>
      <GlossaryForm
        initial={{
          id: term.id,
          slug: term.slug,
          term: term.term,
          definition: term.definition,
          longDescription: term.longDescription,
          category: term.category,
          status: term.status,
          relatedTerms: term.relatedTerms,
          relatedGuides: term.relatedGuides,
          relatedFish: term.relatedFish,
          faqs: (term.faqs as { question: string; answer: string }[]) ?? [],
        }}
      />
    </div>
  );
}
