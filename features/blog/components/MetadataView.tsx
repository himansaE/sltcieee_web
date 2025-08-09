"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/features/ui/imageUploader";
import { MultiAuthorSelect } from "./MultiAuthorSelect";
import type { Author, OrganizationUnit, Post } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

interface MetadataViewProps {
  post: Partial<PostInput>;
  setPost: Dispatch<SetStateAction<Partial<PostInput>>>;
  authors: Author[];
  organizationUnits: OrganizationUnit[];
}

export function MetadataView({ post, setPost, authors, organizationUnits }: MetadataViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="md:col-span-2 space-y-6">
        <Input
          placeholder="Post Title"
          value={post.title}
          onChange={(e) =>
            setPost({
              ...post,
              title: e.target.value,
              slug: slugify(e.target.value),
            })
          }
          className="text-2xl font-bold h-12"
        />
        <Textarea
          placeholder="Excerpt: A short summary of the post"
          value={post.excerpt}
          onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
        />
        <div>
          <Label>Cover Image <span className="text-red-500">*</span></Label>
          <ImageUploader
            onUploadComplete={(url) => setPost({ ...post, coverImage: url })}
            initialImage={post.coverImage || null}
            uploadPath="blog/covers"
          />
        </div>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="status"
                  checked={post.status === "PUBLISHED"}
                  onCheckedChange={(c) =>
                    setPost({ ...post, status: c ? "PUBLISHED" : "DRAFT" })
                  }
                />
                <Label htmlFor="status">
                  {post.status === "PUBLISHED" ? "Published" : "Draft"}
                </Label>
              </div>
            </div>
            <div>
              <Label>Organization Unit</Label>
              <Select
                value={post.organizationUnitId || undefined}
                onValueChange={(id) =>
                  setPost({ ...post, organizationUnitId: id })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {organizationUnits?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Authors</Label>
              <MultiAuthorSelect
                authors={authors || []}
                selectedAuthorIds={post.authorIds || []}
                onSelectionChange={(ids) =>
                  setPost({ ...post, authorIds: ids })
                }
                isLoading={false}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <Input
                placeholder="web, events, tech"
                value={post.tags?.join(", ")}
                onChange={(e) =>
                  setPost({
                    ...post,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
