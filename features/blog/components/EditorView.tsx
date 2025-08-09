
"use client";

import React from "react";
import { MDXEditor } from "@/features/mdxEditor/components/editor";

interface EditorViewProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function EditorView({ content, onContentChange }: EditorViewProps) {
  return <MDXEditor markdown={content} onChange={onContentChange} />;
}
