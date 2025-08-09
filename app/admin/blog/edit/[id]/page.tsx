"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PostEditorLayout } from "@/features/blog/components/PostEditorLayout";
import Request from "@/lib/http";
import type { Author, OrganizationUnit, Post } from "@prisma/client";
import Spinner from "@/components/ui/spinner";

type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

async function getPost(id: string): Promise<Post> {
  const res = await Request.get(`/api/admin/posts/${id}`);
  return res.data;
}

async function getAuthors(): Promise<Author[]> {
  const res = await Request.get("/api/admin/authors");
  return res.data.data;
}

async function getOrganizationUnits(): Promise<OrganizationUnit[]> {
  const res = await Request.get("/api/admin/organization-units");
  return res.data;
}

async function updatePost({ id, postData }: { id: string; postData: Partial<PostInput> }): Promise<Post> {
  const res = await Request.put(`/api/admin/posts/${id}`, postData);
  return res.data;
}

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: post, isLoading: isLoadingPost } = useQuery<Post, Error>({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });

  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const { data: orgUnits, isLoading: isLoadingOrgUnits } = useQuery({
    queryKey: ["org-units"],
    queryFn: getOrganizationUnits,
  });

  if (isLoadingPost || isLoadingAuthors || isLoadingOrgUnits) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const savePost = (postData: Partial<PostInput>) => updatePost({ id, postData });

  return (
    <PostEditorLayout
      initialPost={post}
      authors={authors || []}
      organizationUnits={orgUnits || []}
      savePost={savePost}
    />
  );
}