import { notFound } from "next/navigation";

export const OnlyDevRender = (children: React.ComponentType) => {
  if (process.env.NODE_ENV === "development") return children;
  return notFound();
};
