"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  imageAutocompleteSuggestions$,
  imageDialogState$,
  editorRootElementRef$,
  imageUploadHandler$,
  saveImage$,
  closeImageDialog$,
  useCellValues,
  usePublisher,
} from "@mdxeditor/editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";

const validationSchema = Yup.object({
  file: Yup.mixed().nullable(),
  src: Yup.string().when("file", {
    is: null,
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then: (schema) => schema.url("Must be a valid URL"),
    otherwise: (schema) => schema.optional(),
  }),
  altText: Yup.string(),
  title: Yup.string(),
});

export function ImageDialog() {
  const [imageAutocompleteSuggestions, state, , imageUploadHandler] =
    useCellValues(
      imageAutocompleteSuggestions$,
      imageDialogState$,
      editorRootElementRef$,
      imageUploadHandler$
    );

  const saveImage = usePublisher(saveImage$);

  const closeImageDialog = usePublisher(closeImageDialog$);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      file: null as unknown as File | null | undefined,
      src: state.type === "editing" ? state.initialValues?.src || "" : "",
      altText:
        state.type === "editing" ? state.initialValues?.altText || "" : "",
      title: state.type === "editing" ? state.initialValues?.title || "" : "",
    },

    enableReinitialize: true,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (!values.file && state.type === "new") {
        formik.setFieldError("file", "Please provide an image file or URL");
        return;
      }

      if (state.type === "new" || (state.type === "editing" && values.file)) {
        const toastId = toast.loading("Uploading image...");
        try {
          let imageUrl = values.src;
          if (values.file) {
            imageUrl = (await imageUploadHandler?.(values.file)) ?? "";
          }

          if (!imageUrl || !values.file) {
            throw new Error("Please provide an image file or URL");
          }

          const fileList = new DataTransfer();
          fileList.items.add(values.file);
          saveImage({
            src: imageUrl,
            altText: values.altText,
            title: values.title,
            file: fileList as unknown as FileList,
          });

          toast.success("Image uploaded successfully", { id: toastId });
        } catch (error) {
          console.error(error);
          toast.error(
            error instanceof Error ? error.message : "Failed to upload image",
            {
              id: toastId,
            }
          );
          formik.setFieldError("file", "Failed to upload image");
        }
      }
      closeImageDialog();
    },
  });

  useEffect(() => {
    // Handle file upload preview
    if (formik.values.file) {
      const objectUrl = URL.createObjectURL(formik.values.file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    // Handle URL preview
    if (formik.values.src) {
      setPreviewUrl(formik.values.src);
      return () => {};
    }

    setPreviewUrl(null);
  }, [formik.values.file, formik.values.src]);

  return (
    <Dialog
      open={state.type !== "inactive"}
      onOpenChange={(open) => {
        if (!open) {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          closeImageDialog();
          formik.resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg transition-colors",
              "hover:bg-muted/50",
              !formik.values.file && "cursor-pointer",
              formik.errors.file && "border-red-500"
            )}
            onClick={() =>
              !formik.values.file &&
              document.getElementById("file-input")?.click()
            }
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl}
                  unoptimized
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    formik.setFieldValue("file", null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Click to upload an image
                </p>
              </div>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                formik.setFieldValue("file", file);
                formik.setFieldValue("src", "");
              }
            }}
          />

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              {...formik.getFieldProps("src")}
              placeholder="Uploaded image URL"
              disabled
              list="image-suggestions"
            />
            {imageAutocompleteSuggestions?.length > 0 && (
              <datalist id="image-suggestions">
                {imageAutocompleteSuggestions.map((suggestion, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            )}
            {formik.touched.src && formik.errors.src && (
              <p className="text-sm text-red-500">{formik.errors.src}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                {...formik.getFieldProps("altText")}
                placeholder="Image description"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                {...formik.getFieldProps("title")}
                placeholder="Image title"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                closeImageDialog();
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                (!formik.values.file && !formik.values.src)
              }
            >
              {formik.isSubmitting ? (
                <>
                  <Spinner className=" h-4 w-4 " />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Insert Image
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
