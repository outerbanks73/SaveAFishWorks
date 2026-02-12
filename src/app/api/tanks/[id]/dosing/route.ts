import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import type { DosingMethod } from "@prisma/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const schedules = await prisma.dosingSchedule.findMany({ where: { tankId: id } });
  return NextResponse.json({ schedules });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const schedule = await prisma.dosingSchedule.create({
    data: {
      tankId: id,
      method: (body.method ?? "ALL_IN_ONE") as DosingMethod,
      fertBrand: body.fertBrand ?? null,
      fertProductName: body.fertProductName ?? null,
      doseAmountMl: body.doseAmountMl ?? null,
      frequencyDays: body.frequencyDays ?? null,
      dayPattern: body.dayPattern ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json({ schedule }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { scheduleId } = await req.json();
  if (!scheduleId) return NextResponse.json({ error: "scheduleId required" }, { status: 400 });

  await prisma.dosingSchedule.delete({ where: { id: scheduleId } });
  return NextResponse.json({ success: true });
}
