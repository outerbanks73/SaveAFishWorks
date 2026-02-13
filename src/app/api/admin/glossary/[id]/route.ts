import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const term = await prisma.glossaryTerm.findUnique({ where: { id } });
  if (!term) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(term);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const existing = await prisma.glossaryTerm.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const term = await prisma.glossaryTerm.update({
    where: { id },
    data: {
      slug: body.slug,
      term: body.term,
      definition: body.definition,
      longDescription: body.longDescription ?? "",
      category: body.category ?? "",
      status: body.status,
      relatedTerms: body.relatedTerms ?? [],
      relatedGuides: body.relatedGuides ?? [],
      relatedFish: body.relatedFish ?? [],
      faqs: body.faqs ?? [],
    },
  });

  revalidatePath("/glossary");
  return NextResponse.json(term);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.glossaryTerm.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/glossary");
  return NextResponse.json({ success: true });
}
