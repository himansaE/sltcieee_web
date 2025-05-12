"use client";

import { useCreateUser } from "@/lib/api/users.Fn";
import { Role } from "@prisma/client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, ShieldAlert, Shield, User as UserIcon } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the form validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  role: Yup.string()
    .required("Role is required")
    .oneOf(Object.values(Role), "Invalid role"),
  emailVerified: Yup.boolean(),
});

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: Role.user,
      emailVerified: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createUser(values);
        toast.success("User created successfully");
        formik.resetForm();
        onOpenChange(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "An error occurred while creating the user";
        toast.error(errorMsg);
      }
    },
  });

  const handleClose = () => {
    if (!isPending) {
      formik.resetForm();
      onOpenChange(false);
    }
  };

  // Get role details for display
  const getRoleDetails = (role: Role) => {
    switch (role) {
      case Role.admin:
        return {
          icon: <ShieldAlert className="h-4 w-4 mr-2" />,
          label: "Administrator",
          description: "Full access to all features and user management",
        };
      case Role.content:
        return {
          icon: <Shield className="h-4 w-4 mr-2" />,
          label: "Content Manager",
          description: "Can create and manage content but not users",
        };
      default:
        return {
          icon: <UserIcon className="h-4 w-4 mr-2" />,
          label: "User",
          description: "Basic access with limited permissions",
        };
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...formik.getFieldProps("name")}
                disabled={isPending}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="john.doe@example.com"
                type="email"
                {...formik.getFieldProps("email")}
                disabled={isPending}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
                disabled={isPending}
              >
                <SelectTrigger id="role" className="w-full">
                  {formik.values.role ? (
                    <div className="flex items-center">
                      {getRoleDetails(formik.values.role).icon}
                      <span>{getRoleDetails(formik.values.role).label}</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a role" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Role).map((role) => {
                    const roleInfo = getRoleDetails(role as Role);
                    return (
                      <SelectItem key={role} value={role} className="py-2.5">
                        <div className="flex items-center">
                          <div className="mr-2 mt-0.5">{roleInfo.icon}</div>
                          <div>
                            <div className="font-medium">{roleInfo.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {roleInfo.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="emailVerified"
                checked={formik.values.emailVerified}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("emailVerified", Boolean(checked))
                }
                disabled={isPending}
              />
              <div>
                <Label htmlFor="emailVerified" className="text-sm font-medium">
                  Email Verified
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mark this user&apos;s email as verified (skip verification
                  email)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
