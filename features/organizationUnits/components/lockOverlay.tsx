import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockOverlayProps {
  isLocked: boolean;
  onToggleLock: () => void;
}

export function LockOverlay({ isLocked, onToggleLock }: LockOverlayProps) {
  if (!isLocked) return null;

  return (
    <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-[50] animate-in fade-in-0">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
          <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
            <Lock
              className="h-8 sm:h-10 w-8 sm:w-10 text-primary"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-bold text-xl sm:text-2xl">Access Locked</h3>
            <p className="text-sm text-muted-foreground">
              This section is currently locked. Use the button below to unlock
              access.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={onToggleLock}
          >
            <Unlock className="h-4 w-4" />
            Unlock Access
          </Button>
        </div>
      </div>
    </div>
  );
}
