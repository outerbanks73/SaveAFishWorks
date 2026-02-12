import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const searchParams = req.nextUrl.searchParams;
  const tankId = searchParams.get("tankId");
  const category = searchParams.get("category");
  const overdue = searchParams.get("overdue");

  const where: Prisma.MaintenanceTaskWhereInput = { userId: session!.user.id };
  if (tankId) where.tankId = tankId;
  if (category) where.category = category as Prisma.MaintenanceTaskWhereInput["category"];
  if (overdue === "true") where.nextDue = { lt: new Date() };

  const tasks = await prisma.maintenanceTask.findMany({
    where,
    orderBy: { nextDue: "asc" },
    include: {
      tank: { select: { id: true, name: true } },
      completions: { orderBy: { completedAt: "desc" }, take: 3 },
    },
  });

  return NextResponse.json({ tasks });
}
