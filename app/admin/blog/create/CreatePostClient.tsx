"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PostEditorLayout } from "@/features/blog/components/PostEditorLayout";
import Request from "@/lib/http";
import type { Author, OrganizationUnit, Post } from "@prisma/client";
import Spinner from "@/components/ui/spinner";

type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

async function getAuthors(): Promise<Author[]> {
  const res = await Request.get("/api/admin/authors");
  return res.data.data;
}

async function getOrganizationUnits(): Promise<OrganizationUnit[]> {
  const res = await Request.get("/api/admin/organization-units");
  return res.data;
}

async function createPost(postData: Partial<PostInput>): Promise<Post> {
  const res = await Request.post("/api/admin/posts", postData);
  return res.data;
}

export default function CreatePostClient() {
  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const { data: orgUnits, isLoading: isLoadingOrgUnits } = useQuery({
    queryKey: ["org-units"],
    queryFn: getOrganizationUnits,
  });

  if (isLoadingAuthors || isLoadingOrgUnits) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <PostEditorLayout
      authors={authors || []}
      organizationUnits={orgUnits || []}
      savePost={createPost}
    />
  );
}
