import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNotification } from "@/lib/notifications/service";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find overdue tasks that haven't been notified recently
  const overdueTasks = await prisma.maintenanceTask.findMany({
    where: {
      nextDue: { lt: now },
    },
    include: {
      tank: { select: { name: true } },
      user: { select: { id: true } },
    },
  });

  let notified = 0;

  for (const task of overdueTasks) {
    // Check if we already sent a notification for this task in the last 24h
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId: task.userId,
        type: "OVERDUE",
        title: { contains: task.title },
        sentAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    });

    if (!recentNotification) {
      await sendNotification({
        userId: task.userId,
        type: "OVERDUE",
        title: `Overdue: ${task.title}`,
        body: `${task.title} for "${task.tank.name}" is overdue. It was due ${new Date(task.nextDue).toLocaleDateString()}.`,
        link: `/dashboard/maintenance`,
      });
      notified++;
    }
  }

  // Find tasks due today
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const dueTodayTasks = await prisma.maintenanceTask.findMany({
    where: {
      nextDue: { gte: now, lte: todayEnd },
    },
    include: {
      tank: { select: { name: true } },
    },
  });

  for (const task of dueTodayTasks) {
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId: task.userId,
        type: "MAINTENANCE_DUE",
        title: { contains: task.title },
        sentAt: { gte: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
      },
    });

    if (!recentNotification) {
      await sendNotification({
        userId: task.userId,
        type: "MAINTENANCE_DUE",
        title: `Due today: ${task.title}`,
        body: `${task.title} for "${task.tank.name}" is due today.`,
        link: `/dashboard/maintenance`,
      });
      notified++;
    }
  }

  return NextResponse.json({ success: true, checked: overdueTasks.length + dueTodayTasks.length, notified });
}
