import { sendEmail } from "@/lib/services/mailer";

export { sendEmail };

// Note: Resend has been replaced by Nodemailer (Gmail OAuth2).
// This file remains as a thin shim to avoid breaking imports during migration.
