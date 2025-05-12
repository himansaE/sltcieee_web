import { ResetPasswordEmail } from "./ResetPasswordEmail";
import { LoginLinkEmail } from "./LoginLinkEmail";
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

/**
 * Generates HTML for login link emails using our React template
 *
 * @param userName The name of the user to address in the email
 * @param loginLink The login link URL
 * @returns The generated HTML content for the email
 */
export function generateLoginLinkEmailHTML(
  userName: string,
  loginLink: string
) {
  const emailComponent = React.createElement(LoginLinkEmail, {
    userName,
    loginLink,
  });

  return renderReactEmailToHtml(emailComponent);
}
