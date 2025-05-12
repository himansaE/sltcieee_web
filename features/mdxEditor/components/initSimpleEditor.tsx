"use client";

import type { ForwardedRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { simpleMdxPlugins } from "../lib/plugin";

export default function InitializedSimpleMDXEditor({
  editorRef,
  plugins = [],
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <div className="w-full">
      <MDXEditor
        className="relative  min-w-full w-full rounded-lg border border-gray-200 bg-white"
        contentEditableClassName="prose min-h-[270px] p-4 min-w-full"
        plugins={[...simpleMdxPlugins, ...plugins]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
}
