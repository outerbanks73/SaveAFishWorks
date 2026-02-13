import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const templates = await prisma.configuratorTemplate.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const { error } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const template = await prisma.configuratorTemplate.create({
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

  return NextResponse.json(template, { status: 201 });
}
