import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import {
  createEvent,
  EventWithOrganization,
  updateEvent,
} from "@/lib/api/events.Fn";
import { toast } from "sonner";
import { useOrganizationUnits } from "@/hooks/useOrganizationUnit";
import Spinner from "@/components/ui/spinner";
import { cn, getImageUrl } from "@/lib/utils";
import { uploadFile } from "@/lib/api/uploadFile";
import { useState } from "react";
import { eventValidationSchema } from "@/lib/validation/event";
import { DatePicker } from "@/components/ui/date-picker";
import { EventType } from "@prisma/client";
import { eventTypeNames } from "@/lib/constant/event";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

type BaseAddEventProps = {
  refetchEvents: () => void;
};

type CreateEventProps = BaseAddEventProps & {
  mode?: "create";
  event?: never;
  open?: never;
  onOpenChange?: never;
};

type EditEventProps = BaseAddEventProps & {
  mode: "edit";
  event: EventWithOrganization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectOnEdit?: boolean;
};

type AddNewEventProps = CreateEventProps | EditEventProps;

export default function AddNewEvent(props: AddNewEventProps) {
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(false);
  const open = props.mode === "edit" ? props.open : isOpened;
  const handleOpenChange =
    props.mode === "edit" ? props.onOpenChange : setIsOpened;

  const [logoUrl, setLogoUrl] = useState<string | null>(
    props.mode === "edit" ? getImageUrl(props.event?.image) : null
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    props.mode === "edit" ? getImageUrl(props.event?.coverImage) : null
  );

  const { mutateAsync: uploadFileMutation, isPending: isUploading } =
    useMutation({
      mutationFn: uploadFile,
    });

  const { mutateAsync: eventMutation, isPending: isMutating } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (values: any) => {
      const msg = toast.loading(
        props.mode === "create" ? "Creating event..." : "Updating event..."
      );

      try {
        if (props.mode === "create" && (!values.logo || !values.coverImage)) {
          toast.error("Both logo and cover image are required", { id: msg });
          throw new Error("Images required");
        }

        const [logoData, coverData] = await Promise.all([
          values.logo instanceof File
            ? uploadFileMutation({
                buffer: values.logo,
                key: values.logo.name,
                path: "event/logo",
              })
            : { filename: props.event?.image },
          values.coverImage instanceof File
            ? uploadFileMutation({
                buffer: values.coverImage,
                key: values.coverImage.name,
                path: "event/cover",
              })
            : { filename: props.event?.coverImage },
        ]);

        const submitData = {
          ...values,
          image: logoData.filename,
          coverImage: coverData.filename,
          organizationUnitId: values.organizationUnit,
        };

        const result =
          props.mode === "edit" && props.event
            ? await updateEvent({
                id: props.event.id,
                data: submitData,
              })
            : await createEvent(submitData);

        toast.success(
          `Event ${
            props.mode === "create" ? "created" : "updated"
          } successfully`,
          { id: msg }
        );

        if (
          props.mode === "edit" &&
          props.redirectOnEdit &&
          props.event.slug !== result.slug
        ) {
          router.push(`/admin/events/${result.slug}`);
        }

        props.refetchEvents();
        handleClose();
        return result;
      } catch (error) {
        toast.error("An error occurred. Please try again.", { id: msg });
        throw error;
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      title: props.event?.title ?? "",
      description: props.event?.description ?? "",
      date: props.event?.date ? new Date(props.event.date) : null,
      organizationUnit: props.event?.organizationUnitId ?? "",
      eventType: props.event?.eventType ?? "PUBLIC",
      location: props.event?.location ?? "",
      logo: null,
      coverImage: null,
    },
    validationSchema:
      props.mode === "edit"
        ? eventValidationSchema.clone().shape({
            logo: Yup.mixed().nullable(),
            coverImage: Yup.mixed().nullable(),
          })
        : eventValidationSchema,
    onSubmit: (data) => eventMutation(data),
  });

  // Type guard for edit mode props
  const isEditMode = (p: AddNewEventProps): p is EditEventProps => {
    return p.mode === "edit";
  };

  const handleClose = () => {
    handleOpenChange(false);
    formik.resetForm();
    if (!isEditMode(props)) {
      setLogoUrl(null);
      setCoverImageUrl(null);
    } else {
      setLogoUrl(getImageUrl(props.event.image));
      setCoverImageUrl(getImageUrl(props.event.coverImage));
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || isLoading || isMutating) return;

    const file = event.target.files[0];
    if (file) {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(URL.createObjectURL(file));
      formik.setFieldValue("logo", file);
    }
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length || isLoading || isMutating) return;

    const file = event.target.files[0];
    if (file) {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
      setCoverImageUrl(URL.createObjectURL(file));
      formik.setFieldValue("coverImage", file);
    }
  };

  const { data: organizationUnits, isLoading: isOrganizationUnitsLoading } =
    useOrganizationUnits({ withEvents: false });

  const isLoading = isOrganizationUnitsLoading || isUploading || isMutating;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEditMode(props) && (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            {props.mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="relative w-full h-64 rounded-lg my-2 ">
              <div
                className={cn(
                  "w-full h-full bg-cover bg-center bg-gray-100 rounded-lg overflow-hidden ",
                  formik.touched.coverImage &&
                    formik.errors.coverImage &&
                    "ring-2 ring-red-500"
                )}
                style={{
                  backgroundImage: coverImageUrl
                    ? `url(${coverImageUrl})`
                    : "none",
                }}
              >
                <div className="absolute inset-0 bg-black/20 rounded-lg" />
                {!coverImageUrl ? (
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-200/50 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-600">
                        Upload Cover Image
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        JPG, PNG or WebP (max 5MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverImageChange}
                      disabled={isLoading || isUploading}
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(coverImageUrl);
                      setCoverImageUrl(null);
                      formik.setFieldValue("coverImage", null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                    disabled={isLoading || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Logo Upload */}
                <div className="absolute left-8 -bottom-6">
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(logoUrl);
                        setLogoUrl(null);
                        formik.setFieldValue("logo", null);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
                      disabled={isLoading || isUploading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <div
                    className={cn(
                      "relative w-24 h-24 rounded-full  bg-white shadow-lg ring-4 overflow-hidden",
                      formik.touched.logo && formik.errors.logo
                        ? "ring-red-500"
                        : "ring-white"
                    )}
                  >
                    {logoUrl ? (
                      <>
                        <Image
                          src={logoUrl}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </>
                    ) : (
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                          <span className="mt-1 block text-xs font-medium text-gray-600">
                            Logo
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoChange}
                          disabled={isLoading || isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...formik.getFieldProps("title")}
                  disabled={isLoading || isUploading}
                  placeholder="Event Title"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationUnit">Organization Unit</Label>
                <Select
                  value={formik.values.organizationUnit}
                  onValueChange={(value) =>
                    formik.setFieldValue("organizationUnit", value)
                  }
                  disabled={isLoading || isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationUnits?.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.organizationUnit &&
                  formik.errors.organizationUnit && (
                    <p className="text-sm text-red-500">
                      {formik.errors.organizationUnit}
                    </p>
                  )}
              </div>

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <DatePicker
                  date={formik.values.date || undefined}
                  onSelect={(date) => formik.setFieldValue("date", date)}
                  placeholder="Select event date"
                  error={!!(formik.touched.date && formik.errors.date)}
                  disabled={isLoading || isUploading}
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-sm text-red-500">
                    {formik.errors.date as string}
                  </p>
                )}
              </div>

              {props.mode === "create" && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...formik.getFieldProps("description")}
                    disabled={isLoading || isUploading}
                    placeholder="Event Description"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-sm text-red-500">
                      {formik.errors.description}
                    </p>
                  )}
                </div>
              )}

              {props.mode === "create" && (
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={formik.values.eventType}
                    onValueChange={(value) =>
                      formik.setFieldValue("eventType", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EventType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {eventTypeNames[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...formik.getFieldProps("location")}
                  disabled={isLoading || isUploading}
                  placeholder="Online or Location"
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="text-sm text-red-500">
                    {formik.errors.location}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 p-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <Spinner className="mr-2" />}
            {props.mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
