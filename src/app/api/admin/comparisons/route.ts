import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const comparisons = await prisma.comparison.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(comparisons);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const comparison = await prisma.comparison.create({
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      image: body.image || null,
      optionA: body.optionA ?? {},
      optionB: body.optionB ?? {},
      criteria: body.criteria ?? [],
      verdict: body.verdict ?? "",
      status: body.status ?? "DRAFT",
      relatedComparisons: body.relatedComparisons ?? [],
      relatedGuides: body.relatedGuides ?? [],
      faqs: body.faqs ?? [],
      createdById: session!.user.id,
    },
  });

  revalidatePath("/compare");
  return NextResponse.json(comparison, { status: 201 });
}
