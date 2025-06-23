import { ReactElement } from "react";
import { render } from "@react-email/render";

/**
 * Renders a React Email component to HTML for email sending
 *
 * @param component The React Email component to render
 * @returns The rendered HTML string
 */
export function renderReactEmailToHtml(component: ReactElement) {
  return render(component);
}
