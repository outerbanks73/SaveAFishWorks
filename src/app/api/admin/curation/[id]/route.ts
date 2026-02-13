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
  const list = await prisma.curationList.findUnique({ where: { id } });
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(list);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const existing = await prisma.curationList.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const list = await prisma.curationList.update({
    where: { id },
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      intro: body.intro ?? "",
      image: body.image || null,
      items: body.items ?? [],
      status: body.status,
      relatedLists: body.relatedLists ?? [],
      relatedGuides: body.relatedGuides ?? [],
      targetPersonas: body.targetPersonas ?? [],
      faqs: body.faqs ?? [],
    },
  });

  revalidatePath("/best");
  return NextResponse.json(list);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.curationList.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/best");
  return NextResponse.json({ success: true });
}
