"use client";

import React from "react";
import type { Post } from "@prisma/client";
import { MarkdownRender } from "@/features/markdown/render";
import { getImageUrl } from "@/lib/utils";

type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

interface PreviewViewProps {
  post: Partial<PostInput>;
}

export function PreviewView({ post }: PreviewViewProps) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1>{post.title}</h1>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getImageUrl(post.coverImage as string)}
          alt={post.title || "Cover image"}
        />
      )}
      <MarkdownRender content={post.content || ""} />
    </article>
  );
}
