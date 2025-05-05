"use client";

import { useEffect, useState } from "react";
import { useUser, useUpdateUser } from "@/lib/api/users.Fn";
import { Role } from "@prisma/client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Save, ShieldAlert, Shield, UserIcon, LockIcon } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth/client";

interface EditUserDialogProps {
  userId: string;
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
  role: Yup.mixed()
    .required("Role is required")
    .oneOf(Object.values(Role), "Invalid role"),
  emailVerified: Yup.boolean(),
});

export function EditUserDialog({
  userId,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const { data: user, isLoading } = useUser(userId);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const [initialRoleSet, setInitialRoleSet] = useState(false);
  const { data: currentUser } = authClient.useSession();
  const currentUserRole = currentUser?.user.role as Role;

  const formik = useFormik<{
    name: string;
    email: string;
    role: Role;
    emailVerified: boolean;
  }>({
    initialValues: {
      name: "",
      email: "",
      role: Role.user,
      emailVerified: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateUser({
          userId,
          userData: values,
        });
        toast.success("User updated successfully");
        onOpenChange(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "An error occurred while updating the user";
        toast.error(errorMsg);
      }
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        role: user.role as Role,
        emailVerified: user.emailVerified,
      });
      setInitialRoleSet(true);
    }
  }, [user]);

  const handleClose = () => {
    if (!isUpdating) {
      formik.resetForm();
      onOpenChange(false);
    }
  };

  // Check if the current user can modify the role of the target user
  const canModifyRole = () => {
    // User cannot change their own role
    if (currentUser?.user?.id === userId) {
      return false;
    }

    if (currentUserRole === Role.admin) return true;

    if (currentUserRole === Role.content) {
      // Content admins cannot set anyone to admin role
      if (user?.role === Role.admin) {
        return false;
      }
      return true;
    }

    return false;
  };

  // Function to get allowed roles for the select dropdown based on current user's permissions
  const getAllowedRoles = () => {
    if (currentUserRole === Role.admin) {
      return Object.values(Role);
    } else if (currentUserRole === Role.content) {
      // Content admins cannot promote to admin role
      return [Role.user, Role.content];
    }
    return [user?.role as Role];
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleRoleChange = (newRole: Role) => {
    if (!initialRoleSet) return;

    // Check if user can modify roles
    if (!canModifyRole()) {
      const message =
        currentUser?.user?.id === userId
          ? "You cannot change your own role"
          : "You don't have permission to change this user's role";
      toast.error(message);
      return;
    }

    // Content admins can't set anyone to admin role
    if (currentUserRole === Role.content && newRole === Role.admin) {
      toast.error("You don't have permission to assign administrator role");
      return;
    }

    // Set the new role value
    formik.setFieldValue("role", newRole);
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

  const isFormProcessing = isLoading || isUpdating;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner className="h-6 w-6" />
            </div>
          ) : !user ? (
            <div className="py-6 text-center text-destructive">
              User not found or failed to load
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
              {/* User Avatar */}
              <div className="flex justify-center pb-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...formik.getFieldProps("name")}
                  disabled={isFormProcessing}
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
                  disabled={isFormProcessing}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center">
                  Role
                  {!canModifyRole() && (
                    <span className="ml-2 text-xs flex items-center text-muted-foreground">
                      <LockIcon className="h-3 w-3 mr-1" />
                      {currentUser?.user?.id === userId
                        ? "You cannot change your own role"
                        : "You don't have permission to change this user's role"}
                    </span>
                  )}
                </Label>
                <Select
                  value={formik.values.role}
                  onValueChange={(value) => handleRoleChange(value as Role)}
                  disabled={isFormProcessing || !canModifyRole()}
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
                    {getAllowedRoles().map((role) => {
                      const roleInfo = getRoleDetails(role as Role);
                      return (
                        <SelectItem key={role} value={role} className="py-2.5">
                          <div className="flex items-center">
                            <div className="mr-2 mt-0.5">{roleInfo.icon}</div>
                            <div>
                              <div className="font-medium">
                                {roleInfo.label}
                              </div>
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

                {currentUserRole === Role.content && (
                  <p className="text-xs text-muted-foreground mt-1">
                    As a Content Manager, you can only manage regular users. You
                    cannot promote users to Administrator role.
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="emailVerified"
                  checked={formik.values.emailVerified}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("emailVerified", Boolean(checked))
                  }
                  disabled={isFormProcessing}
                />
                <div>
                  <Label
                    htmlFor="emailVerified"
                    className="text-sm font-medium"
                  >
                    Email Verified
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mark this user&apos;s email as verified
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isFormProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isFormProcessing || !formik.dirty}
                >
                  {isUpdating ? (
                    <>
                      <Spinner className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
