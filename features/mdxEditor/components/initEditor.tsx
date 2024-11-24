"use client";

import type { ForwardedRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { mdxPlugins } from "../lib/plugin";

export default function InitializedMDXEditor({
  editorRef,
  plugins = [],
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <div className="w-full">
      <MDXEditor
        className="relative  min-w-full w-full rounded-lg border border-gray-200 bg-white"
        contentEditableClassName="prose min-h-[500px] p-4 min-w-full"
        plugins={[...mdxPlugins, ...plugins]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
}
