import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GuideForm } from "@/components/admin/GuideForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGuidePage({ params }: Props) {
  const { id } = await params;
  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Edit Guide</h1>
      <GuideForm
        initial={{
          id: guide.id,
          slug: guide.slug,
          title: guide.title,
          description: guide.description,
          category: guide.category,
          author: guide.author,
          bodyMarkdown: guide.bodyMarkdown,
          readingTime: guide.readingTime,
          image: guide.image ?? "",
          status: guide.status,
          relatedGuides: guide.relatedGuides,
          relatedFish: guide.relatedFish,
          relatedProducts: guide.relatedProducts,
          relatedGlossaryTerms: guide.relatedGlossaryTerms,
          faqs: (guide.faqs as { question: string; answer: string }[]) ?? [],
        }}
      />
    </div>
  );
}
