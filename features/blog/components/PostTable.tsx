"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { FileX } from "lucide-react";
import type { Post, Author, OrganizationUnit } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

import { getImageUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PostWithRelations = Post & {
  authors: Author[];
  organizationUnit: OrganizationUnit | null;
};

interface PostTableProps {
  posts: PostWithRelations[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function PostTable({ posts, page, pageCount, onPageChange }: PostTableProps) {
  const router = useRouter();

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {pageCount > 1 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
}

function PostCard({ post }: { post: PostWithRelations }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED", publishedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post published");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const draftMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT", publishedAt: null }),
      });
      if (!res.ok) throw new Error("Failed to make draft");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post moved to draft");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="flex flex-col overflow-hidden">
      {post.coverImage ? (
        <div className="relative h-40 w-full">
          <Image
            src={getImageUrl(post.coverImage)}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      ) : null}
      <CardHeader>
        <Badge
          variant={post.status === "PUBLISHED" ? "default" : "outline"}
          className="w-fit"
        >
          {post.status}
        </Badge>
        <CardTitle className="mt-2 line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          By {post.authors.map((a) => a.name).join(", ") || "Unknown"}
        </p>
        {post.organizationUnit?.title && (
          <p className="text-xs text-muted-foreground mt-1">
            In {post.organizationUnit.title}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {format(new Date(post.updatedAt), "MMM d, yyyy")}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
          >
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {post.status === "PUBLISHED" ? (
                <DropdownMenuItem disabled={draftMutation.isPending} onClick={() => draftMutation.mutate()}>
                  {draftMutation.isPending ? "Updating..." : "Make Draft"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled={publishMutation.isPending} onClick={() => publishMutation.mutate()}>
                  {publishMutation.isPending ? "Publishing..." : "Publish"}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={deleteMutation.isPending}
                className="text-red-600"
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <FileX className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No Blog Posts Found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by creating a new post.
      </p>
    </div>
  );
}
