import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [userCount, tankCount, productCount, configCount, overdueTasks, notificationCount] = await Promise.all([
    prisma.user.count(),
    prisma.tank.count(),
    prisma.adminProduct.count(),
    prisma.savedConfiguration.count(),
    prisma.maintenanceTask.count({ where: { nextDue: { lt: new Date() } } }),
    prisma.notification.count(),
  ]);

  return NextResponse.json({
    users: userCount,
    tanks: tankCount,
    products: productCount,
    configurations: configCount,
    overdueTasks,
    notifications: notificationCount,
  });
}
