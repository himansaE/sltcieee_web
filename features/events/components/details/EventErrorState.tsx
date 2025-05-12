import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EventErrorState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive w-fit mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Unable to Load Event
        </h2>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading this event. The event might have
          been deleted or you may not have permission to view it.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/admin/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
