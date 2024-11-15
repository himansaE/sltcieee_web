import {
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  diffSourcePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  KitchenSinkToolbar,
} from "@mdxeditor/editor";
import { imageUpload } from "./image";
import { ImageDialog } from "../imageDialog";

export const mdxPlugins = [
  toolbarPlugin({
    toolbarClassName:
      "sticky !top-[65px] z-50 flex flex-wrap items-center gap-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200  rounded-t-lg",
    toolbarContents: () => KitchenSinkToolbar({}),
  }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageUploadHandler: imageUpload,
    ImageDialog: ImageDialog,
    // imagePreviewHandler: (src) => src,
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "Plain Text",
      tsx: "TypeScript",
      "": "Unspecified",
    },
  }),
  directivesPlugin({
    directiveDescriptors: [
      //   YoutubeDirectiveDescriptor,
      AdmonitionDirectiveDescriptor,
    ],
  }),
  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
  markdownShortcutPlugin(),
];
