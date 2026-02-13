import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(terms);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const term = await prisma.glossaryTerm.create({
    data: {
      slug: body.slug,
      term: body.term,
      definition: body.definition,
      longDescription: body.longDescription ?? "",
      category: body.category ?? "",
      status: body.status ?? "DRAFT",
      relatedTerms: body.relatedTerms ?? [],
      relatedGuides: body.relatedGuides ?? [],
      relatedFish: body.relatedFish ?? [],
      faqs: body.faqs ?? [],
      createdById: session!.user.id,
    },
  });

  revalidatePath("/glossary");
  return NextResponse.json(term, { status: 201 });
}
