import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const config = await prisma.savedConfiguration.findFirst({
    where: { id, userId: session!.user.id },
    include: { tank: { select: { id: true, name: true } } },
  });

  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ configuration: config });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.savedConfiguration.findFirst({
    where: { id, userId: session!.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const config = await prisma.savedConfiguration.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      data: body.data ?? existing.data,
      tankId: body.tankId !== undefined ? body.tankId : existing.tankId,
    },
  });

  return NextResponse.json({ configuration: config });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.savedConfiguration.findFirst({
    where: { id, userId: session!.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.savedConfiguration.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
