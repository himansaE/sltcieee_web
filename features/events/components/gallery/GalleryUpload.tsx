import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/api/uploadFile";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";

interface GalleryUploadProps {
  eventId: string;
  onUploadComplete: (imageUrl: string, caption: string) => Promise<void>;
  variant?: "default" | "primary";
}

export function GalleryUpload({
  eventId,
  onUploadComplete,
  variant = "default",
}: GalleryUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(file));
        setSelectedFile(file);
      }
    },
    [imagePreview]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setIsUploading(true);
      const uploadResult = await uploadFileMutation({
        buffer: selectedFile,
        key: selectedFile.name,
        path: `event/${eventId}/gallery`,
      });

      await onUploadComplete(uploadResult.filename, caption);

      toast.success("Image added to gallery");
      handleClose();
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setCaption("");
  };

  const dropzoneClasses = cn(
    "aspect-video relative rounded-lg border-2 border-dashed transition-colors cursor-pointer",
    "border-muted-foreground/25 hover:border-muted-foreground/40",
    isDragActive && "border-primary/50 bg-primary/5",
    isDragAccept && "border-green-500/50 bg-green-500/5",
    isDragReject && "border-red-500/50 bg-red-500/5"
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "default" ? (
          <Button size="sm" variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        ) : (
          <Button>
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Images
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Gallery</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Image Upload Area with Drag & Drop */}
          <div className="space-y-2">
            <Label>Image</Label>
            <div {...getRootProps()} className={dropzoneClasses}>
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <div
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (imagePreview) URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 block text-sm font-medium">
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop an image here or click to browse"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      JPG, PNG, WebP, GIF up to 5MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption for this image"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
