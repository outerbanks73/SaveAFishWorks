import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CurationForm } from "@/components/admin/CurationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCurationPage({ params }: Props) {
  const { id } = await params;
  const list = await prisma.curationList.findUnique({ where: { id } });
  if (!list) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Curation List</h1>
      <CurationForm
        initial={{
          id: list.id,
          slug: list.slug,
          title: list.title,
          description: list.description,
          intro: list.intro,
          image: list.image ?? "",
          items: list.items as { productSlug: string; rank: number; verdict: string; bestFor: string }[],
          status: list.status,
          relatedLists: list.relatedLists,
          relatedGuides: list.relatedGuides,
          targetPersonas: list.targetPersonas,
          faqs: (list.faqs as { question: string; answer: string }[]) ?? [],
        }}
      />
    </div>
  );
}
