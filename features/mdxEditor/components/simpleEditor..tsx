"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const Editor = dynamic(() => import("./initSimpleEditor"), {
  ssr: false,
});

export const SimpleMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
);

SimpleMDXEditor.displayName = "ForwardRefEditor";
