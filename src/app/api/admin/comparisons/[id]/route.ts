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
  const comparison = await prisma.comparison.findUnique({ where: { id } });
  if (!comparison) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(comparison);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const existing = await prisma.comparison.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comparison = await prisma.comparison.update({
    where: { id },
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      image: body.image || null,
      optionA: body.optionA ?? {},
      optionB: body.optionB ?? {},
      criteria: body.criteria ?? [],
      verdict: body.verdict ?? "",
      status: body.status,
      relatedComparisons: body.relatedComparisons ?? [],
      relatedGuides: body.relatedGuides ?? [],
      faqs: body.faqs ?? [],
    },
  });

  revalidatePath("/compare");
  return NextResponse.json(comparison);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.comparison.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/compare");
  return NextResponse.json({ success: true });
}
