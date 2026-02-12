import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");

  const [logs, total] = await Promise.all([
    prisma.waterLog.findMany({
      where: { tankId: id, userId: session!.user.id },
      orderBy: { loggedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.waterLog.count({ where: { tankId: id, userId: session!.user.id } }),
  ]);

  return NextResponse.json({ logs, total, page, limit });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const tank = await prisma.tank.findFirst({ where: { id, userId: session!.user.id } });
  if (!tank) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const log = await prisma.waterLog.create({
    data: {
      userId: session!.user.id,
      tankId: id,
      temperature: body.temperature ?? null,
      ph: body.ph ?? null,
      ammonia: body.ammonia ?? null,
      nitrite: body.nitrite ?? null,
      nitrate: body.nitrate ?? null,
      kh: body.kh ?? null,
      gh: body.gh ?? null,
      tds: body.tds ?? null,
      co2Ppm: body.co2Ppm ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
