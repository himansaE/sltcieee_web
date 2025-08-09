import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new blog post",
};

import CreatePostClient from "./CreatePostClient";

export default function Page() {
  return <CreatePostClient />;
}
