import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const configs = await prisma.savedConfiguration.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    include: { tank: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ configurations: configs });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const { name, data, tankId } = body;

  if (!name || !data) {
    return NextResponse.json({ error: "Name and data are required" }, { status: 400 });
  }

  const config = await prisma.savedConfiguration.create({
    data: {
      userId: session!.user.id,
      name,
      data,
      tankId: tankId ?? null,
    },
  });

  return NextResponse.json({ configuration: config }, { status: 201 });
}
