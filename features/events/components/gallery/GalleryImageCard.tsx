import { GalleryItemResponse } from "@/lib/api/eventGallery.Fn";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, X, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface GalleryImageCardProps {
  item: GalleryItemResponse;
  onDelete: (id: string) => Promise<void>;
}

export function GalleryImageCard({ item, onDelete }: GalleryImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
      toast.success("Image removed from gallery");
    } catch (error) {
      toast.error("Failed to remove image");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        <div
          className="relative h-48 w-full cursor-pointer"
          onClick={() => setShowFullImage(true)}
        >
          <Image
            src={getImageUrl(item.imageUrl)}
            alt={item.caption || "Gallery image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Caption and Actions */}
        <div className="p-3">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-700 line-clamp-2">
              {item.caption || "No caption"}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-1.5 flex-shrink-0"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Added {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl w-full h-full max-h-[80vh] animate-in zoom-in-90 duration-300">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 border-0 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullImage(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="relative h-full w-full">
              <Image
                src={getImageUrl(item.imageUrl)}
                alt={item.caption || "Gallery image"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                {item.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
