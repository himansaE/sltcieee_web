"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useFormik } from "formik";
import { useState } from "react";
import { TextInput } from "@/components/widgets/textInput";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api/uploadFile";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { organizationUnitValidationSchema } from "@/lib/validation/organizationUnit";
import { createOrganizationUnit } from "@/lib/api/organizationUnitFn";

export default function AddNewOrganizationUnit(props: { refresh: () => void }) {
  const [isOpened, setIsOpened] = useState(false);

  const formik = useFormik({
    initialValues: {
      logo: null,
      title: "",
      description: "",
    },
    validationSchema: organizationUnitValidationSchema,
    onSubmit: async (values) => {
      const msg = toast.loading("Uploading Organization Unit Logo...");

      if (!values.logo) {
        formik.setFieldError("logo", "Organization Unit logo is required");
        return;
      }
      const data = await uploadFileMutation({
        buffer: values.logo,
        key: (values.logo as File)?.name ?? "",
      }).catch((error) => {
        toast.error(error.message, {
          id: msg,
        });
        return null;
      });
      if (!data) return;

      toast.loading("Creating Organization Unit...", {
        id: msg,
      });

      await createOrganizationUnitMutation({
        title: values.title,
        description: values.description,
        image: data.filename,
      }).catch((error) => {
        toast.error(error.message, {
          id: msg,
        });
      });

      toast.success("Organization Unit has been created.", {
        id: msg,
      });
    },
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (isCreatingOrganizationUnit || isUploading) return;

    const file = event.target.files?.[0];
    if (file) {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(URL.createObjectURL(file));
      formik.setFieldValue("logo", file);
    }
  };

  const { mutateAsync: uploadFileMutation, isPending: isUploading } =
    useMutation({
      mutationFn: uploadFile,
    });

  const {
    mutateAsync: createOrganizationUnitMutation,
    isPending: isCreatingOrganizationUnit,
  } = useMutation({
    mutationFn: createOrganizationUnit,
    onSuccess: () => {
      props.refresh();
      formik.resetForm();
      setLogoUrl(null);
      setIsOpened(false);
    },
  });

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <Button
        onClick={() => {
          setIsOpened(true);
        }}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Unit
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Organization Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="logo" className="block mb-2">
              Organization Unit Logo
            </Label>
            <div className="flex items-center justify-center">
              <Label
                htmlFor="logo"
                className={cn(
                  "cursor-pointer flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 border-dashed hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                  formik.errors.logo && "border-red-600"
                )}
              >
                {formik.values.logo || logoUrl ? (
                  <Image
                    src={logoUrl ?? ""}
                    alt="Event logo"
                    className="w-full h-full object-contain rounded-full"
                    height={24}
                    width={24}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isCreatingOrganizationUnit || isUploading}
                  className="hidden"
                  aria-label="Upload event logo"
                />
              </Label>
            </div>
            <div className="text-center text-xs text-red-600">
              {formik.touched.logo && formik.errors.logo}
            </div>
          </div>

          <TextInput
            id="title"
            name="title"
            label="Organization Unit Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="Enter event title"
            errorMessage={(formik.touched.title && formik.errors.title) || ""}
            disabled={isCreatingOrganizationUnit || isUploading}
          />

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Enter a brief description of the Organization Unit"
              rows={3}
              disabled={isCreatingOrganizationUnit || isUploading}
            />
            <div className="text-xs text-red-600">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isUploading || isCreatingOrganizationUnit}
          >
            {isUploading || isCreatingOrganizationUnit ? (
              <Spinner />
            ) : (
              "Add Organization Unit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
