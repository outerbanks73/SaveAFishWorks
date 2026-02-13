import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const guides = await prisma.guide.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(guides);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const guide = await prisma.guide.create({
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description,
      category: body.category,
      author: body.author,
      bodyMarkdown: body.bodyMarkdown ?? "",
      readingTime: body.readingTime ?? "5 min read",
      image: body.image || null,
      status: body.status ?? "DRAFT",
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      relatedGuides: body.relatedGuides ?? [],
      relatedFish: body.relatedFish ?? [],
      relatedProducts: body.relatedProducts ?? [],
      relatedGlossaryTerms: body.relatedGlossaryTerms ?? [],
      faqs: body.faqs ?? [],
      createdById: session!.user.id,
    },
  });

  revalidatePath("/guides");
  return NextResponse.json(guide, { status: 201 });
}
