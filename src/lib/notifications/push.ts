import webpush from "web-push";
import { prisma } from "@/lib/db";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@aquaticmotiv.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(options: {
  userId: string;
  title: string;
  body: string;
  link?: string;
}) {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    console.log("[Push] VAPID not configured, skipping push:", options.title);
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: options.userId },
  });

  const payload = JSON.stringify({
    title: options.title,
    body: options.body,
    url: options.link ?? "/dashboard/maintenance",
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      );
    } catch (err: unknown) {
      // Remove invalid subscriptions
      if (err && typeof err === "object" && "statusCode" in err && ((err as { statusCode: number }).statusCode === 404 || (err as { statusCode: number }).statusCode === 410)) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      }
    }
  }
}
