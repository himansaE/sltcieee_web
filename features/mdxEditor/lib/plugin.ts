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
} from "@mdxeditor/editor";
import { imageUpload } from "./image";
import { ImageDialog } from "../components/dialogs/imageDialog";
import { LinkDialog } from "../components/dialogs/linkDialog";
import { YoutubeDirectiveDescriptor } from "../components/directives/youtube";
import { MdxEditorToolbar } from "../components/toolbar";

export const mdxPlugins = [
  toolbarPlugin({
    toolbarClassName:
      "sticky !top-[65px] z-50 flex flex-wrap items-center gap-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200  rounded-t-lg",
    toolbarContents: MdxEditorToolbar,
  }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin({
    LinkDialog: LinkDialog,
  }),
  imagePlugin({
    imageUploadHandler: imageUpload,
    ImageDialog: ImageDialog,
    disableImageSettingsButton: true,
    imagePreviewHandler: (src) => Promise.resolve(src),
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
      YoutubeDirectiveDescriptor,
      AdmonitionDirectiveDescriptor,
    ],
  }),

  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
  markdownShortcutPlugin(),
];
