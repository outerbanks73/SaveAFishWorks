import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { getAllGuides } from "@/lib/data/guides";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  try {
    const count = await prisma.guide.count();
    if (count > 0) {
      const rows = await prisma.guide.findMany({
        select: { slug: true, title: true },
        orderBy: { title: "asc" },
      });
      return NextResponse.json(rows);
    }
  } catch {
    // fall through
  }

  const guides = await getAllGuides();
  return NextResponse.json(guides.map((g) => ({ slug: g.slug, title: g.title })));
}
