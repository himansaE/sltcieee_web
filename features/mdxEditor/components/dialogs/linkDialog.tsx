"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cancelLinkEdit$,
  linkDialogState$,
  removeLink$,
  switchFromPreviewToLinkEdit$,
  updateLink$,
  useCellValues,
  usePublisher,
  activeEditor$,
  onWindowChange$,
  editorRootElementRef$,
} from "@mdxeditor/editor";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Pencil, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CSSProperties } from "react";

const validationSchema = Yup.object({
  url: Yup.string().url("Must be a valid URL").required("URL is required"),
  title: Yup.string().optional(),
});

export const LinkDialog = () => {
  const [editorRootElementRef, activeEditor, linkDialogState] = useCellValues(
    editorRootElementRef$,
    activeEditor$,
    linkDialogState$
  );

  const publishWindowChange = usePublisher(onWindowChange$);
  const updateLink = usePublisher(updateLink$);
  const cancelLinkEdit = usePublisher(cancelLinkEdit$);
  const switchToEdit = usePublisher(switchFromPreviewToLinkEdit$);
  const removeLink = usePublisher(removeLink$);

  React.useEffect(() => {
    const update = () => {
      activeEditor?.getEditorState().read(() => {
        publishWindowChange(true);
      });
    };

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [activeEditor, publishWindowChange]);

  const theRect = linkDialogState.rectangle;

  // Helper function to handle dialog closing
  const handleClose = () => {
    if (linkDialogState.type === "edit") {
      cancelLinkEdit();
    } else {
      cancelLinkEdit();
    }
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      url: linkDialogState.type === "edit" ? linkDialogState.url || "" : "",
      title: linkDialogState.type === "edit" ? linkDialogState.title || "" : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (linkDialogState.type === "edit") updateLink(values);
    },
  });

  const getAdjustedPosition = React.useCallback((): CSSProperties => {
    if (!theRect || !editorRootElementRef?.current)
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };

    return {
      position: "fixed" as const,
      top: theRect.top,
      left: theRect.left,
      width: theRect.width,
      height: theRect.height,
      transform: "none",
      zIndex: 50,
    };
  }, [theRect, editorRootElementRef]);

  return (
    <>
      <Popover open={linkDialogState.type === "preview"}>
        <PopoverTrigger asChild>
          <div
            className="fixed opacity-0 touch-none pointer-events-none"
            style={getAdjustedPosition()}
          />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={0}
          alignOffset={0}
          avoidCollisions={true}
          sticky="always"
          style={{ width: "auto", minWidth: "max-content" }}
          className="w-auto p-2"
        >
          {linkDialogState.type === "preview" && (
            <div className="flex items-center gap-1 flex-col">
              <a
                href={linkDialogState.url}
                className="flex-1 truncate text-blue-500 hover:underline text-sm max-w-64"
                target="_blank"
                rel="noreferrer"
              >
                {linkDialogState.url}
              </a>
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6"
                  onClick={() => switchToEdit()}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6"
                  onClick={() => {
                    navigator.clipboard.writeText(linkDialogState.url);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6"
                  onClick={() => {
                    removeLink();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <Dialog
        open={linkDialogState.type === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                {...formik.getFieldProps("url")}
                placeholder="https://example.com"
                list="link-suggestions"
              />

              {formik.touched.url && formik.errors.url && (
                <p className="text-sm text-red-500">{formik.errors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                {...formik.getFieldProps("title")}
                placeholder="Link title"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose} // Use the helper function
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                <Link className="h-4 w-4 mr-2" />
                {linkDialogState.type === "edit" ? "Save" : "Insert"} Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
