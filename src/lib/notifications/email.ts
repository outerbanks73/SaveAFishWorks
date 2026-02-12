import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "notifications@aquaticmotiv.com";

export async function sendNotificationEmail(options: {
  to: string;
  subject: string;
  body: string;
  link?: string;
}) {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping email:", options.subject);
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: #0d9488; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Aquatic Motiv</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 12px; color: #1a1a2e; font-size: 18px;">${options.subject}</h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">${options.body}</p>
        ${options.link ? `<a href="${options.link}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #0d9488; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">View Details</a>` : ""}
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html,
  });
}
