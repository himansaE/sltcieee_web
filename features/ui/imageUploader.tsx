"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn, getImageUrl } from "@/lib/utils";
import { uploadFile } from "@/lib/api/uploadFile";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
  initialImage?: string | null;
  uploadPath: string; // e.g., "blog/covers"
  disabled?: boolean;
}

export function ImageUploader({
  onUploadComplete,
  initialImage,
  uploadPath,
  disabled = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      const tempPreview = URL.createObjectURL(file);
      setPreview(tempPreview);

      try {
        const result = await uploadFileMutation({
          buffer: file,
          key: file.name,
          path: uploadPath,
        });
        onUploadComplete(result.filename);
        setPreview(result.filename);
        toast.success("Image uploaded successfully.");
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        setPreview(initialImage || null); // Revert on error
      } finally {
        setIsUploading(false);
        URL.revokeObjectURL(tempPreview);
      }
    },
  [uploadFileMutation, onUploadComplete, uploadPath, initialImage, disabled]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading || disabled,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const dropzoneClasses = cn(
    "relative aspect-video w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center text-center",
    "border-muted-foreground/25 hover:border-muted-foreground/40",
    isDragActive && "border-primary/50 bg-primary/5",
    isDragAccept && "border-green-500/50 bg-green-500/5",
    isDragReject && "border-red-500/50 bg-red-500/5",
  (isUploading || disabled) && "cursor-not-allowed opacity-70 pointer-events-none"
  );

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadComplete(""); // Notify parent that image is removed
  };

  const resolvedPreview = (() => {
    if (!preview) return null;
    if (preview.startsWith("blob:")) return preview;
    if (/^https?:\/\//i.test(preview)) return preview;
    return getImageUrl(preview);
  })();

  return (
    <div {...getRootProps()} className={dropzoneClasses}>
      <input {...getInputProps()} />

      {resolvedPreview ? (
        <>
          <Image
            src={resolvedPreview}
            alt="Image Preview"
            fill
            className="object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-background/80 text-destructive rounded-full p-1.5 z-10"
            disabled={isUploading || disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="p-4">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">
            {isDragActive
              ? "Drop the image here..."
              : "Drop cover image or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm font-semibold">Uploading...</p>
        </div>
      )}
    </div>
  );
}
