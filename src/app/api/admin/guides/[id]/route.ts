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
  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(guide);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const guide = await prisma.guide.update({
    where: { id },
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description,
      category: body.category,
      author: body.author,
      bodyMarkdown: body.bodyMarkdown ?? "",
      readingTime: body.readingTime,
      image: body.image || null,
      status: body.status,
      publishedAt: body.status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      relatedGuides: body.relatedGuides ?? [],
      relatedFish: body.relatedFish ?? [],
      relatedProducts: body.relatedProducts ?? [],
      relatedGlossaryTerms: body.relatedGlossaryTerms ?? [],
      faqs: body.faqs ?? [],
    },
  });

  revalidatePath("/guides");
  return NextResponse.json(guide);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.guide.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/guides");
  return NextResponse.json({ success: true });
}
