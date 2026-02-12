import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const task = await prisma.maintenanceTask.findFirst({
    where: { id, userId: session!.user.id },
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const now = new Date();

  // Create completion record
  await prisma.maintenanceCompletion.create({
    data: {
      taskId: id,
      completedAt: now,
      notes: body.notes ?? null,
    },
  });

  // Advance nextDue
  const nextDue = new Date(now.getTime() + task.frequencyDays * 24 * 60 * 60 * 1000);

  const updated = await prisma.maintenanceTask.update({
    where: { id },
    data: { lastCompleted: now, nextDue },
  });

  return NextResponse.json({ task: updated });
}
