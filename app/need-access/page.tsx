import Link from "next/link";

export const metadata = {
  title: "Access Required",
  description: "You do not have permission to view this page.",
};

export default function NeedAccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">
          You don’t have permission to access this area. Please contact an administrator if you think this is a mistake.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link className="underline" href="/">Go to Home</Link>
          <Link className="underline" href="/login">Login</Link>
        </div>
      </div>
    </main>
  );
}
