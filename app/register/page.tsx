"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import { OnlyDevRender } from "@/components/onlyDev";

function RegisterAdmin() {
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);

  const formik = useFormik({
    initialValues: {
      name: params.get("name") ?? "",
      email: params.get("email") ?? "",
      password: params.get("password") ?? "",
    },

    onSubmit: async (values) => {
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
    <div className="flex h-screen">
      {/* Left side - Logo and background */}
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
        <div className="font-secondary  text-white text-2xl font-semibold text-center rounded-lg bg-black bg-opacity-30 py-1 px-4">
          IEEE Young Professionals Sri Lanka
        </div>
      </div>
      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create an Admin Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You&apos;re a developer. Check the console!
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="name" className="sr-only">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                />
              </div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
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
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={formik.isSubmitting}
                loading={formik.isSubmitting}
              >
                Register
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an admin account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlyDevRender(RegisterAdmin);
