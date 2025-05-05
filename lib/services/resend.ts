import { Resend } from "resend";
import { ServerEnv } from "@/lib/env/server";

// Initialize Resend with API key from environment variables
export const resend = new Resend(ServerEnv.RESEND.API_KEY);

// Default from email address
export const DEFAULT_FROM_EMAIL =
  ServerEnv.RESEND.API_KEY || "noreply@sltc.ieee.org";

/**
 * Send an email using Resend
 *
 * @param options Email options including to, subject, html content, etc.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: replyTo,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
