import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export function SessionsList({ sessions }: { sessions: any[] }) {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No sessions added yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={getImageUrl(session.image)}
                alt={session.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium truncate">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(session.date), "PPP 'at' p")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {session.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
