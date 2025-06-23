"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "@/components/ui/spinner";

interface InvitationInfo {
  id: string;
  email: string;
  name?: string;
  expiresAt: string;
}

export default function AcceptInvitationPage() {
  const router = useRouter();

  // Wrap useSearchParams in a client component with proper suspense handling
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <InvitationForm router={router} />
    </React.Suspense>
  );
}

function InvitationForm({ router }: { router: ReturnType<typeof useRouter> }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<InvitationInfo | null>(
    null
  );

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Missing invitation token");
      setIsLoading(false);
      return;
    }

    async function validateToken() {
      try {
        const response = await fetch(
          `/api/auth/invitation/validate?token=${token}`
        );
        const data = await response.json();

        if (!response.ok || !data.valid) {
          setError(data.error || "Invalid or expired invitation token");
          return;
        }

        setInvitationInfo(data.invitation);
      } catch (err) {
        setError("Failed to validate invitation token");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, [token]);

  // Form validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  // Form initialization
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/auth/invitation/accept", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to accept invitation");
          return;
        }

        toast.success("Account created successfully!");

        // If we were successfully auto-signed in, redirect to dashboard
        if (!data.requiresLogin) {
          router.push("/admin/dashboard");
        } else {
          // Otherwise, redirect to login page
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Invitation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show accept invitation form
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2 flex-col gap-5 bg-gradient-to-br from-sky-700 via-sky-600 to-blue-900 relative items-center justify-center">
        <div className="relative bg-white/95 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-blue-500/20">
          <Image
            src="/sb-icon-color.webp"
            alt="IEEE SLTC Logo"
            width={200}
            height={200}
            priority
            className="max-w-sm rounded-lg"
            unoptimized
          />
        </div>
        <div className="relative font-secondary text-white text-2xl font-semibold text-center rounded-lg bg-black/30 backdrop-blur-md py-3 px-8 shadow-xl border border-white/10">
          IEEE Student Branch Chapter of SLTC
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="lg:hidden flex flex-col items-center mb-8">
          <Image
            src="/sb-icon-color.webp"
            alt="IEEE SLTC Logo"
            width={100}
            height={100}
            priority
            unoptimized
            className="bg-white rounded-full overflow-hidden"
          />
        </div>

        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Complete Your Registration
              </CardTitle>
              <CardDescription>
                Welcome {invitationInfo?.name || invitationInfo?.email}! Set
                your password to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={invitationInfo?.email || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting ? <Spinner className="mr-2" /> : null}
                  Set Password & Continue
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <Link
                  href="/login"
                  className="text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Return to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
