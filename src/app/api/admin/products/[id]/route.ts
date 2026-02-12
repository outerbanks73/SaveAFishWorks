import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const product = await prisma.adminProduct.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.adminProduct.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const product = await prisma.adminProduct.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      category: body.category ?? existing.category,
      price: body.price ?? existing.price,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
      shopifyProductId: body.shopifyProductId !== undefined ? body.shopifyProductId : existing.shopifyProductId,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      metadata: body.metadata !== undefined ? body.metadata : existing.metadata,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  // Soft delete by deactivating
  await prisma.adminProduct.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
