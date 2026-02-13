import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { getAllFish } from "@/lib/data/fish";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  try {
    const count = await prisma.fishSpecies.count();
    if (count > 0) {
      const rows = await prisma.fishSpecies.findMany({
        select: { slug: true, commonName: true },
        orderBy: { commonName: "asc" },
      });
      return NextResponse.json(rows.map((r) => ({ slug: r.slug, title: r.commonName })));
    }
  } catch {
    // fall through
  }

  const fish = await getAllFish();
  return NextResponse.json(fish.map((f) => ({ slug: f.slug, title: f.commonName })));
}
