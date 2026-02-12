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

  const plants = await prisma.tankPlant.findMany({ where: { tankId: id } });
  return NextResponse.json({ plants });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const plant = await prisma.tankPlant.create({
    data: {
      tankId: id,
      plantName: body.plantName,
      scientificName: body.scientificName ?? null,
      quantity: body.quantity ?? 1,
      placement: body.placement ?? null,
      co2Required: body.co2Required ?? false,
      lightNeed: body.lightNeed ?? null,
    },
  });

  return NextResponse.json({ plant }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { plantId } = await req.json();
  if (!plantId) return NextResponse.json({ error: "plantId required" }, { status: 400 });

  await prisma.tankPlant.delete({ where: { id: plantId } });
  return NextResponse.json({ success: true });
}
