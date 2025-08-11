"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getImageUrl, cn } from "@/lib/utils";
import { uploadFile } from "@/lib/api/uploadFile";
import Request from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon, Loader2, RefreshCw, Save } from "lucide-react";

const fetchRoundTable = async (): Promise<{ photos: string[] }> => {
  const res = await Request.get("/api/admin/round-table");
  return res.data;
};

const saveRoundTable = async (photos: string[]) => {
  const res = await Request.put("/api/admin/round-table", { photos });
  return res.data as { photos: string[] };
};

export default function RoundTablePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["round-table"],
    queryFn: fetchRoundTable,
  });

  const [local, setLocal] = useState<string[]>(["", "", "", "", ""]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (data?.photos) setLocal(data.photos);
  }, [data]);

  const { mutateAsync: saveMutation, isPending: saving } = useMutation({
    mutationFn: async () => saveRoundTable(local),
    onSuccess: () => {
      toast.success("Round table updated");
      queryClient.invalidateQueries({ queryKey: ["round-table"] });
    },
    onError: () => toast.error("Failed to save changes"),
  });

  const handleUpload = async (idx: number, file: File) => {
    let tempUrl: string | undefined;
    try {
      setUploadingIndex(idx);
      tempUrl = URL.createObjectURL(file);
      setLocal((arr) => {
        const next = [...arr];
        next[idx] = tempUrl!;
        return next;
      });

      const result = await uploadFile({ buffer: file, key: file.name, path: "round-table" });
      setLocal((arr) => {
        const next = [...arr];
        next[idx] = result.filename; // store filename; renderer resolves to URL
        return next;
      });
      toast.success("Image uploaded");
    } catch (e) {
      console.error(e);
      toast.error("Upload failed");
    } finally {
  if (typeof window !== "undefined")
        try {
          // Revoke only the temporary blob URL we created
          // Using a local variable ensures we don't accidentally revoke a storage key
          inputRefs.current[idx]?.form?.reset?.();
          // Best-effort revoke
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          tempUrl && URL.revokeObjectURL(tempUrl);
        } catch {}
      setUploadingIndex(null);
    }
  };

  const handleRemove = (idx: number) => {
    setLocal((arr) => {
      const next = [...arr];
      next[idx] = "";
      return next;
    });
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Round Table</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => data?.photos && setLocal(data.photos)}
            disabled={saving || isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={() => saveMutation()} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {local.map((val, idx) => {
          const isBlob = val?.startsWith("blob:");
          const src = val ? (isBlob ? val : getImageUrl(val)) : "";
          const busy = uploadingIndex === idx;
          return (
            <Card key={idx} className="relative aspect-video overflow-hidden">
              {src ? (
                <Image
                  src={src}
                  alt={`Member ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm">Upload photo #{idx + 1}</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 justify-end bg-gradient-to-t from-black/40 to-transparent">
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  id={`round-table-file-${idx}`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(idx, f);
                    // Clear value so selecting the same file later re-triggers change
                    if (e.currentTarget) e.currentTarget.value = "";
                  }}
                  disabled={busy}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => inputRefs.current[idx]?.click()}
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
                {val && (
                  <Button size="sm" variant="destructive" onClick={() => handleRemove(idx)} disabled={busy}>
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
