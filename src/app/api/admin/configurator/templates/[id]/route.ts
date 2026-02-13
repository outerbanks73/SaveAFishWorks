import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const template = await prisma.configuratorTemplate.findUnique({ where: { id } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const template = await prisma.configuratorTemplate.update({
    where: { id },
    data: {
      templateId: body.templateId,
      name: body.name,
      description: body.description ?? "",
      style: body.style,
      tankId: body.tankId,
      difficulty: body.difficulty,
      shopifyProductIds: body.shopifyProductIds ?? [],
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.configuratorTemplate.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
