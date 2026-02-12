import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      livestock: true,
      plants: true,
      equipment: true,
      dosingSchedules: true,
      _count: { select: { waterLogs: true, maintenanceTasks: true } },
    },
  });

  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tank });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const tank = await prisma.tank.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      gallons: body.gallons ?? existing.gallons,
      lengthInch: body.lengthInch !== undefined ? body.lengthInch : existing.lengthInch,
      widthInch: body.widthInch !== undefined ? body.widthInch : existing.widthInch,
      heightInch: body.heightInch !== undefined ? body.heightInch : existing.heightInch,
      tankType: body.tankType ?? existing.tankType,
      hasCO2: body.hasCO2 !== undefined ? body.hasCO2 : existing.hasCO2,
      filterType: body.filterType !== undefined ? body.filterType : existing.filterType,
      lightType: body.lightType !== undefined ? body.lightType : existing.lightType,
      heaterWatts: body.heaterWatts !== undefined ? body.heaterWatts : existing.heaterWatts,
    },
  });

  return NextResponse.json({ tank });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.tank.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
