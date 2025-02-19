import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { EventSession } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddSessionDialog } from "../sessions/AddSessionDialog";
import { SessionsList } from "../sessions/sessionsList";

interface SessionsManagerProps {
  eventId: string;
  sessions: EventSession[];
}

export function SessionsManager({ eventId, sessions }: SessionsManagerProps) {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sessions</CardTitle>
        <Button onClick={() => setIsAddingSession(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </CardHeader>

      <CardContent>
        <SessionsList
          sessions={sessions}
          onEdit={(id) => setIsEditing(id)}
          eventId={eventId}
        />
      </CardContent>

      <AddSessionDialog
        open={isAddingSession}
        onOpenChange={setIsAddingSession}
        eventId={eventId}
      />

      {isEditing && (
        <AddSessionDialog
          open={true}
          onOpenChange={() => setIsEditing(null)}
          eventId={eventId}
          sessionId={isEditing}
        />
      )}
    </Card>
  );
}
