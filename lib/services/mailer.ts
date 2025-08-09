import nodemailer from "nodemailer";
import { google } from "googleapis";
import { ServerEnv } from "@/lib/env/server";

// A friendly default display name; actual email will be the Gmail user
export const DEFAULT_FROM_NAME = "IEEE SLTC";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string; // Optional override. If not provided, will use `${DEFAULT_FROM_NAME} <GMAIL_USER>`
  replyTo?: string;
}

/**
 * Send an email using Nodemailer with Gmail OAuth2
 */
export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailOptions) {
  try {
    // Lazily obtain an access token using the refresh token
    const oAuth2Client = new google.auth.OAuth2(
      ServerEnv.GMAIL.CLIENT_ID,
      ServerEnv.GMAIL.CLIENT_SECRET
      // redirect URI is not required here since we're using an existing refresh token
    );

    oAuth2Client.setCredentials({ refresh_token: ServerEnv.GMAIL.REFRESH_TOKEN });

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = typeof accessTokenResponse === "string" ? accessTokenResponse : accessTokenResponse?.token;

    // Use explicit Gmail SMTP settings to prefer STARTTLS on 587 (avoids some networks blocking 465)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        type: "OAuth2",
        user: ServerEnv.GMAIL.USER,
        clientId: ServerEnv.GMAIL.CLIENT_ID,
        clientSecret: ServerEnv.GMAIL.CLIENT_SECRET,
        refreshToken: ServerEnv.GMAIL.REFRESH_TOKEN,
        accessToken: accessToken || undefined,
      },
    });

    const defaultFrom = `${DEFAULT_FROM_NAME} <${ServerEnv.GMAIL.USER}>`;

    const info = await transporter.sendMail({
      from: from || defaultFrom,
      to,
      subject,
      html,
      replyTo,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error("Failed to send email via Nodemailer:", error);
    throw error;
  }
}
