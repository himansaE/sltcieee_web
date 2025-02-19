"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/uploadFile";
import { TextInput } from "@/components/widgets/textInput";
import { useFormik } from "formik";
import { organizationUnitValidationSchema } from "@/lib/validation/organizationUnit";
import { getImageUrl } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";
import type { OrganizationUnitWithEvents } from "@/lib/api/organizationUnitFn";

export default function EditOrganizationUnit({
  unit,
  onRefresh,
}: {
  unit: OrganizationUnitWithEvents;
  onRefresh: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: unit.title,
      description: unit.description,
      slug: unit.slug,
      logo: null as File | null,
    },
    validationSchema: organizationUnitValidationSchema,
    onSubmit: async (values) => {
      const msg = toast.loading("Updating organization unit...");

      try {
        let imageFilename = unit.image;

        if (values.logo) {
          toast.loading("Uploading new logo...", { id: msg });
          const uploadResult = await uploadFileMutation.mutateAsync({
            buffer: values.logo,
            key: values.logo.name,
          });
          imageFilename = uploadResult.filename;
        }

        await updateMutation.mutateAsync({
          id: unit.id,
          title: values.title,
          description: values.description,
          slug: values.slug,
          image: imageFilename,
        });

        toast.success("Organization unit updated successfully", { id: msg });
        setIsOpen(false);
        onRefresh();
      } catch {
        toast.error("Failed to update organization unit", { id: msg });
      }
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch(`/api/admin/organization-units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(URL.createObjectURL(file));
      formik.setFieldValue("logo", file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="ml-2"
      >
        <Edit2Icon className="h-4 w-4" />
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization Unit</DialogTitle>
          <DialogDescription>
            Make changes to the organization unit details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label>Logo</Label>
            <div className="flex justify-center mt-2">
              <Label
                htmlFor="logo-upload"
                className="cursor-pointer relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                <Image
                  src={logoUrl || getImageUrl(unit.image)}
                  alt="Organization Unit Logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <Input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Label>
            </div>
          </div>

          <TextInput
            id="title"
            label="Title"
            {...formik.getFieldProps("title")}
            error={formik.touched.title ? formik.errors.title : undefined}
          />

          <TextInput
            id="slug"
            label="URL Slug"
            {...formik.getFieldProps("slug")}
            error={formik.touched.slug ? formik.errors.slug : undefined}
            instructionMessage="URL-friendly version of the title (lowercase letters, numbers, and hyphens only)"
          />

          <div>
            <Label>Description</Label>
            <Textarea
              {...formik.getFieldProps("description")}
              rows={4}
              className="mt-1"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              formik.isSubmitting ||
              updateMutation.isPending ||
              uploadFileMutation.isPending
            }
          >
            {formik.isSubmitting ||
            updateMutation.isPending ||
            uploadFileMutation.isPending ? (
              <Spinner />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
