import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.maintenanceTask.findFirst({
    where: { id, userId: session!.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const task = await prisma.maintenanceTask.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description !== undefined ? body.description : existing.description,
      frequencyDays: body.frequencyDays ?? existing.frequencyDays,
      nextDue: body.nextDue ? new Date(body.nextDue) : existing.nextDue,
    },
  });

  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.maintenanceTask.findFirst({
    where: { id, userId: session!.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.maintenanceTask.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
