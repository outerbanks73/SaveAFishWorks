import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session!.user.id },
      orderBy: { sentAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where: { userId: session!.user.id } }),
  ]);

  return NextResponse.json({ notifications, total, page, limit });
}
