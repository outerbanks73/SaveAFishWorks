import { prisma } from "@/lib/db";
import { sendNotificationEmail } from "./email";
import { sendPushNotification } from "./push";
import type { NotificationType } from "@prisma/client";

export async function sendNotification(options: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}) {
  // Always create in-app notification
  await prisma.notification.create({
    data: {
      userId: options.userId,
      type: options.type,
      title: options.title,
      body: options.body,
      link: options.link ?? null,
    },
  });

  // Get user email for email notification
  const user = await prisma.user.findUnique({
    where: { id: options.userId },
    select: { email: true },
  });

  // Send email (non-blocking)
  if (user?.email) {
    sendNotificationEmail({
      to: user.email,
      subject: options.title,
      body: options.body,
      link: options.link ? `${process.env.AUTH_URL ?? "http://localhost:3000"}${options.link}` : undefined,
    }).catch((err) => console.error("[Notification] Email failed:", err));
  }

  // Send push (non-blocking)
  sendPushNotification({
    userId: options.userId,
    title: options.title,
    body: options.body,
    link: options.link,
  }).catch((err) => console.error("[Notification] Push failed:", err));
}
