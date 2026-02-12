import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

async function verifyTankOwner(userId: string, tankId: string) {
  return prisma.tank.findFirst({ where: { id: tankId, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const livestock = await prisma.tankLivestock.findMany({ where: { tankId: id } });
  return NextResponse.json({ livestock });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const livestock = await prisma.tankLivestock.create({
    data: {
      tankId: id,
      speciesName: body.speciesName,
      scientificName: body.scientificName ?? null,
      quantity: body.quantity ?? 1,
      maxSizeInch: body.maxSizeInch ?? null,
      temperament: body.temperament ?? null,
      zone: body.zone ?? null,
    },
  });

  return NextResponse.json({ livestock }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { livestockId } = await req.json();
  if (!livestockId) return NextResponse.json({ error: "livestockId required" }, { status: 400 });

  await prisma.tankLivestock.delete({ where: { id: livestockId } });
  return NextResponse.json({ success: true });
}
