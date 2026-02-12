import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.adminProduct.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { title, category, price, imageUrl, shopifyProductId, isActive, metadata } = body;

  if (!title || !category || price == null) {
    return NextResponse.json({ error: "title, category, and price are required" }, { status: 400 });
  }

  const product = await prisma.adminProduct.create({
    data: {
      title,
      category,
      price,
      imageUrl: imageUrl ?? null,
      shopifyProductId: shopifyProductId ?? null,
      isActive: isActive ?? true,
      metadata: metadata ?? null,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
