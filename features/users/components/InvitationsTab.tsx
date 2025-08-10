"use client";

import { useInvitations, useCancelInvitation, useResendInvitation } from "@/lib/api/invitations.Fn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function InvitationsSkeleton() {
  const rows = Array.from({ length: 5 });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell><Skeleton className="h-4 w-44" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell className="text-right space-x-2">
              <Skeleton className="inline-block h-8 w-20" />
              <Skeleton className="inline-block h-8 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function InvitationsTab() {
  const { data, isLoading, isError, refetch } = useInvitations();
  const { mutateAsync: cancelInvite, isPending: canceling } = useCancelInvitation();
  const { mutateAsync: resendInvite, isPending: resending } = useResendInvitation();

  const handleCancel = async (id: string) => {
    try {
      await cancelInvite(id);
      toast.success("Invitation canceled");
    } catch (e) {
      toast.error("Failed to cancel invitation");
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendInvite(id);
      toast.success("Invitation resent with a new token");
    } catch (e) {
      toast.error("Failed to resend invitation");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-none px-0 mx-0 shadow-none">
        <CardContent className="px-0">
          {isLoading ? (
            <InvitationsSkeleton />
          ) : isError ? (
            <div className="space-y-2">
              <div className="text-destructive">Failed to load invitations</div>
              <Button variant="outline" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : !data || data.invitations.length === 0 ? (
            <div className="text-sm text-muted-foreground">No pending invitations</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell>{inv.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inv.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{inv.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(inv.expiresAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleResend(inv.id)} disabled={resending}>
                        <RotateCcw className="h-4 w-4 mr-1" /> Resend
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(inv.id)} disabled={canceling}>
                        <Trash2 className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
