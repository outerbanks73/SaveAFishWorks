import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { getAllProducts } from "@/lib/data/products";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  try {
    const count = await prisma.contentProduct.count();
    if (count > 0) {
      const rows = await prisma.contentProduct.findMany({
        select: { slug: true, name: true },
        orderBy: { name: "asc" },
      });
      return NextResponse.json(rows.map((r) => ({ slug: r.slug, title: r.name })));
    }
  } catch {
    // fall through
  }

  const products = await getAllProducts();
  return NextResponse.json(products.map((p) => ({ slug: p.slug, title: p.name })));
}
