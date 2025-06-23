import React from "react";
import {
  UndoRedo,
  Separator,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertImage,
  ListsToggle,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertAdmonition,
} from "@mdxeditor/editor";
import YouTubeButton from "./dialogs/youtube";

export function Toolbar() {
  return (
    <DiffSourceToggleWrapper>
      {/* Base controls */}
      <div className="flex">
        <UndoRedo />
        <Separator />
      </div>

      {/* Formatting controls */}
      <div className="flex">
        <BoldItalicUnderlineToggles />
        <Separator />
        <BlockTypeSelect />
      </div>

      <div className="flex">
        <ListsToggle />
        <Separator />
      </div>

      {/* Insert tools */}
      <div className="flex">
        <CreateLink />
        <InsertImage />
        <InsertTable />
        <InsertThematicBreak />
        <YouTubeButton />
        <Separator />
      </div>

      {/* Advanced features */}
      <div className="flex">
        <InsertCodeBlock />
        <InsertAdmonition />
      </div>
    </DiffSourceToggleWrapper>
  );
}

export const SimpleMdxEditorToolbar = () => {
  return (
    <>
      {/* Base controls */}
      <div className="flex">
        <UndoRedo />
        <Separator />
      </div>

      {/* Formatting controls */}
      <div className="flex">
        <BoldItalicUnderlineToggles />
        <Separator />
        <BlockTypeSelect />
      </div>

      <div className="flex">
        <ListsToggle />
        <Separator />
      </div>

      {/* Insert tools */}
      <div className="flex">
        <CreateLink />

        <InsertThematicBreak />
        <Separator />
      </div>
    </>
  );
};

export { Toolbar as MdxEditorToolbar };
