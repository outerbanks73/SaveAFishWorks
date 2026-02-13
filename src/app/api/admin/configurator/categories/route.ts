import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const categories = await prisma.categoryConfig.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(categories);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const updates = body as Array<{ name: string; displayOrder: number; isActive: boolean; icon?: string; description?: string }>;

  const results = await Promise.all(
    updates.map((u) =>
      prisma.categoryConfig.upsert({
        where: { name: u.name },
        create: { name: u.name, displayOrder: u.displayOrder, isActive: u.isActive, icon: u.icon || null, description: u.description || null },
        update: { displayOrder: u.displayOrder, isActive: u.isActive, icon: u.icon || null, description: u.description || null },
      })
    )
  );

  return NextResponse.json(results);
}
