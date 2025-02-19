"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import Link from "next/link";
import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth/client";

function RegisterForm() {
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: async (values) => {
      setError(null);
      try {
        await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: "/login",
        });
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
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
          Create Admin Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Register to manage newsletter content
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full"
              placeholder="Enter your full name"
              disabled={formik.isSubmitting}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full"
              placeholder="Enter your email"
              disabled={formik.isSubmitting}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full"
              placeholder="Create a password"
              disabled={formik.isSubmitting}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full"
              placeholder="Confirm your password"
              disabled={formik.isSubmitting}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            disabled={formik.isSubmitting}
            loading={formik.isSubmitting}
          >
            Register
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ModernAdminRegister() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2 flex-col gap-5 bg-gradient-to-br from-sky-700 via-sky-600 to-blue-900 relative items-center justify-center overflow-hidden">
        <div className="relative bg-white/95 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-blue-500/20">
          <Image
            src="/sb-icon-color.webp"
            alt="Newsletter Logo"
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
            alt="Newsletter Logo"
            width={100}
            height={100}
            priority
            unoptimized
            className="bg-white rounded-full overflow-hidden"
          />
        </div>

        <div className="w-full max-w-md">
          <Suspense fallback={<div />}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
