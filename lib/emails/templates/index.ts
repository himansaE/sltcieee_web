import { ResetPasswordEmail } from "./ResetPasswordEmail";
import { renderReactEmailToHtml } from "../renderEmail";
import React from "react";

/**
 * Generates HTML for password reset emails using our React template
 *
 * @param userName The name of the user to address in the email
 * @param resetLink The password reset link URL
 * @returns The generated HTML content for the email
 */
export function generateResetPasswordEmailHTML(
  userName: string,
  resetLink: string
) {
  const emailComponent = React.createElement(ResetPasswordEmail, {
    userName,
    resetLink,
  });

  return renderReactEmailToHtml(emailComponent);
}
