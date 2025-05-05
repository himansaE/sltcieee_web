import { EventSession } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SessionsManagerProps {
  eventId: string;
  sessions: EventSession[];
}

export function SessionsManager({ sessions }: SessionsManagerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sessions</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No sessions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">
              Add sessions to structure this event with specific timelines and
              details
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {session.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
