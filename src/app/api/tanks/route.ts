import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const tanks = await prisma.tank.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { livestock: true, plants: true, equipment: true } },
    },
  });

  return NextResponse.json({ tanks });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const { name, gallons, lengthInch, widthInch, heightInch, tankType, hasCO2, filterType, lightType, heaterWatts } = body;

  if (!name || gallons == null) {
    return NextResponse.json({ error: "Name and gallons are required" }, { status: 400 });
  }

  const tank = await prisma.tank.create({
    data: {
      userId: session!.user.id,
      name,
      gallons,
      lengthInch: lengthInch ?? null,
      widthInch: widthInch ?? null,
      heightInch: heightInch ?? null,
      tankType: tankType ?? "LOW_TECH",
      hasCO2: hasCO2 ?? false,
      filterType: filterType ?? null,
      lightType: lightType ?? null,
      heaterWatts: heaterWatts ?? null,
    },
  });

  return NextResponse.json({ tank }, { status: 201 });
}
