"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { slugify } from "@/lib/utils";
import type { Post, Author, OrganizationUnit } from "@prisma/client";
import { MetadataView } from "./MetadataView";
import { EditorView } from "./EditorView";
import { PreviewView } from "./PreviewView";

// --- Enums and Types ---
export enum EditorViewMode {
  METADATA,
  EDITOR,
  PREVIEW,
}

type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

interface PostEditorLayoutProps {
  initialPost?: Post;
  authors: Author[];
  organizationUnits: OrganizationUnit[];
  savePost: (postData: Partial<PostInput>) => Promise<Post>;
}

export function PostEditorLayout({
  initialPost,
  authors,
  organizationUnits,
  savePost,
}: PostEditorLayoutProps) {
  const router = useRouter();
  const [view, setView] = useState<EditorViewMode>(EditorViewMode.METADATA);
  const [post, setPost] = useState<Partial<PostInput>>(initialPost || {
    title: "",
    slug: "",
    content: "Start writing your amazing post here...",
    coverImage: "",
    excerpt: "",
    tags: [],
    status: "DRAFT",
    authorIds: [],
    organizationUnitId: "",
    publishedAt: null,
  });

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);

  const mutation = useMutation({
    mutationFn: savePost,
    onSuccess: () => {
      toast.success(`Post ${initialPost ? 'updated' : 'created'} successfully!`);
      router.push("/admin/blog");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    // Only require: title, slug (auto), cover image
    if (!post.title) {
      toast.error("Title is required.");
      setView(EditorViewMode.METADATA);
      return;
    }
    if (!post.coverImage) {
      toast.error("Cover Image is required.");
      setView(EditorViewMode.METADATA);
      return;
    }

    const postData = {
      ...post,
      slug: post.slug || slugify(post.title || ""),
      // Content, authors, org unit optional
      publishedAt: post.status === "PUBLISHED" ? new Date() : null,
    };

    mutation.mutate(postData);
  };

  const handleNext = () => {
    if (view === EditorViewMode.METADATA) {
      if (!post.title) {
        toast.error("Title is required to proceed.");
        return;
      }
      if (!post.coverImage) {
        toast.error("Cover Image is required to proceed.");
        return;
      }
    }
    setView((v) => Math.min(v + 1, EditorViewMode.PREVIEW));
  };

  const handlePrevious = () => {
    setView((v) => Math.max(v - 1, EditorViewMode.METADATA));
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-6 flex-grow overflow-y-auto">
            {view === EditorViewMode.METADATA && (
            <MetadataView
                post={post}
                setPost={setPost}
                authors={authors}
                organizationUnits={organizationUnits}
            />
            )}
            {view === EditorViewMode.EDITOR && (
            <EditorView
                content={post.content || ""}
                onContentChange={(c) => setPost((p) => ({ ...p, content: c }))}
            />
            )}
            {view === EditorViewMode.PREVIEW && <PreviewView post={post} />}
        </div>
        <EditorFooter
            currentView={view}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSave}
            isSaving={mutation.isPending}
        />
    </div>
  );
}

// --- Footer ---
interface EditorFooterProps {
  currentView: EditorViewMode;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  isSaving: boolean;
}

function EditorFooter({
  currentView,
  onNext,
  onPrevious,
  onSave,
  isSaving,
}: EditorFooterProps) {
  return (
    <footer className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-3 border-t bg-background">
        <div>
            {currentView !== EditorViewMode.METADATA && (
                <Button variant="ghost" onClick={onPrevious}>Previous</Button>
            )}
        </div>
        <div>
            {currentView !== EditorViewMode.PREVIEW ? (
                <Button onClick={onNext}>Next</Button>
            ) : (
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving ? <Spinner className="mr-2" /> : null}
                    Save Post
                </Button>
            )}
        </div>
    </footer>
  );
}