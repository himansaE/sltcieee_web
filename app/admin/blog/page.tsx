import type { Metadata } from "next";
import BlogManagementClient from "./BlogManagementClient";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Manage blog posts in the IEEE SLTC admin dashboard",
};

export default function BlogManagementPage() {
  return <BlogManagementClient />;
}
