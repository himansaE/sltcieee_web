import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/uploadFile";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface AddSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  sessionId?: string;
}

const sessionValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description must be less than 500 characters"),
  date: Yup.date().required("Date is required"),
  image: Yup.mixed().required("Image is required"),
});

export function AddSessionDialog({
  open,
  onOpenChange,
  eventId,
  sessionId,
}: AddSessionDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
  });

  const { mutate: createSession, isPending: isCreating } = useMutation({
    onSuccess: () => {
      toast.success("Session created successfully");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to create session");
      console.error("Session creation error:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: new Date(),
      image: null,
    },
    validationSchema: sessionValidationSchema,
    onSubmit: (values) => createSession(values),
  });

  const handleClose = () => {
    formik.resetForm();
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      formik.setFieldValue("image", file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl  overflow-y-auto max-h-screen sm:max-h-[calc(100vh-4rem)]">
        <DialogHeader>
          <DialogTitle>
            {sessionId ? "Edit Session" : "Add New Session"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Session Image</Label>
            <div
              className={cn(
                "aspect-video relative rounded-lg border-2 border-dashed",
                formik.touched.image && formik.errors.image
                  ? "border-red-500"
                  : "border-muted-foreground/25"
              )}
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                      formik.setFieldValue("image", null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload session image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {formik.touched.image && formik.errors.image && (
              <p className="text-sm text-destructive">
                {formik.errors.image as string}
              </p>
            )}
          </div>

          {/* Title and Description */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...formik.getFieldProps("title")}
                maxLength={100}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-sm text-destructive">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...formik.getFieldProps("description")}
                maxLength={500}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <DateTimePicker
                date={formik.values.date}
                setDate={(date) => formik.setFieldValue("date", date)}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-sm text-destructive">
                  {formik.errors.date as string}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sessionId ? "Save Changes" : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
