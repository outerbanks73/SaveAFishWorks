import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";

interface Context {
  params: Promise<{ shopifyId: string }>;
}

export async function GET(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { shopifyId } = await ctx.params;
  const override = await prisma.shopifyProductOverride.findUnique({
    where: { shopifyProductId: shopifyId },
  });

  return NextResponse.json({ override });
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { shopifyId } = await ctx.params;
  const body = await req.json();

  const override = await prisma.shopifyProductOverride.upsert({
    where: { shopifyProductId: shopifyId },
    create: {
      shopifyProductId: shopifyId,
      categoryOverride: body.categoryOverride || null,
      isHidden: body.isHidden ?? false,
      sortOrder: body.sortOrder ?? null,
      notes: body.notes || null,
    },
    update: {
      categoryOverride: body.categoryOverride || null,
      isHidden: body.isHidden ?? false,
      sortOrder: body.sortOrder ?? null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(override);
}
