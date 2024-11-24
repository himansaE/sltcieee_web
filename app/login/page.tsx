"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { useState, Suspense } from "react";

// Separate the form into its own component
function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin/dashboard";
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    onSubmit: async (values) => {
      setError(null);
      try {
        const req = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          dontRememberMe: !values.rememberMe,
          callbackURL: decodeURIComponent(callbackUrl),
        });

        if (req.error) {
          setError(req.error.message ?? "An error occurred");
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Failed to fetch") {
            return setError(
              "Failed to connect to the server. Please try again later."
            );
          }
        }
        setError("An error occurred");
      }
    },
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome Back, Admin
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Log in to manage the newsletter
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={cn(
                "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              )}
              placeholder="Email address"
              disabled={formik.isSubmitting}
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              disabled={formik.isSubmitting}
              value={formik.values.password}
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </Label>
          </div>

          <div className="text-sm">
            <Link
              href="/forget-password"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={formik.isSubmitting}
            loading={formik.isSubmitting}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main page component
export default function ModernAdminLogin() {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col gap-5 bg-gradient-to-br from-blue-500 via-green-400 to-orange-500 items-center justify-center p-12">
        <div>
          <Image
            src="/yp_logo.png"
            alt="Newsletter Logo"
            width={200}
            height={200}
            priority
            className="max-w-sm rounded-xl mt-5"
          />
        </div>
        <div className="font-secondary text-white text-2xl font-semibold text-center rounded-lg bg-black bg-opacity-30 py-1 px-4">
          IEEE Young Professionals Sri Lanka
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Suspense fallback={<div />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
