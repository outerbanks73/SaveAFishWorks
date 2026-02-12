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

  const equipment = await prisma.tankEquipment.findMany({ where: { tankId: id } });
  return NextResponse.json({ equipment });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const equipment = await prisma.tankEquipment.create({
    data: {
      tankId: id,
      equipmentType: body.equipmentType,
      brand: body.brand ?? null,
      model: body.model ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json({ equipment }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  if (!(await verifyTankOwner(session!.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { equipmentId } = await req.json();
  if (!equipmentId) return NextResponse.json({ error: "equipmentId required" }, { status: 400 });

  await prisma.tankEquipment.delete({ where: { id: equipmentId } });
  return NextResponse.json({ success: true });
}
