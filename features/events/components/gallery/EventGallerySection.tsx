import { EventWithDetails } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventGallery } from "@/hooks/useEventGallery";
import { toast } from "sonner";
import {
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Trash2,
  Loader2,
  DownloadIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GalleryUpload } from "./GalleryUpload";
import { getImageUrl } from "@/lib/utils";

interface EventGallerySectionProps {
  event: EventWithDetails;
}

export function EventGallerySection({ event }: EventGallerySectionProps) {
  const {
    galleryItems,
    isLoading,
    addGalleryItem,
    deleteGalleryItem,
    isDeleting,
  } = useEventGallery(event.id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Close lightbox with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (e.key === "ArrowRight") {
        navigateImage(1);
      }
    };

    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, galleryItems?.length]);

  const handleAddGalleryItem = async (imageUrl: string, caption: string) => {
    try {
      await addGalleryItem({ imageUrl, caption });
      toast.success("Image added to gallery", {
        description:
          "Your image has been successfully added to the event gallery.",
      });
    } catch (error) {
      toast.error("Failed to add image to gallery", {
        description:
          "There was a problem uploading your image. Please try again.",
      });
      console.error(error);
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    try {
      await deleteGalleryItem(itemId);
      toast.success("Image removed from gallery", {
        description: "The image has been removed from the event gallery.",
      });

      // Close lightbox if the current image was deleted
      if (
        lightboxOpen &&
        galleryItems &&
        galleryItems[currentImageIndex]?.id === itemId
      ) {
        // If it was the last image, close the lightbox
        if (galleryItems.length <= 1) {
          setLightboxOpen(false);
        } else {
          // Otherwise show the next image or previous if it was the last
          setCurrentImageIndex((prev) =>
            prev === galleryItems.length - 1 ? prev - 1 : prev
          );
        }
      }
    } catch (error) {
      toast.error("Failed to remove image from gallery", {
        description:
          "There was a problem removing your image. Please try again.",
      });
      console.error(error);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const navigateImage = (direction: number) => {
    if (!galleryItems?.length) return;

    setCurrentImageIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return galleryItems.length - 1;
      if (newIndex >= galleryItems.length) return 0;
      return newIndex;
    });
  };

  const currentImage = galleryItems?.[currentImageIndex];

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-xl font-semibold">Event Gallery</CardTitle>
        <GalleryUpload
          eventId={event.id}
          onUploadComplete={handleAddGalleryItem}
        />
      </CardHeader>

      <CardContent className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] relative rounded-md bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : !galleryItems?.length ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50 rounded-lg">
            <div className="rounded-full bg-white p-3 mb-4 shadow-sm border border-gray-100">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No Gallery images yet
            </h3>
            <p className="text-sm text-gray-500 mb-5 max-w-sm">
              Add images to showcase this event&apos;s highlights and activities
              for attendees.
            </p>
            <GalleryUpload
              eventId={event.id}
              onUploadComplete={handleAddGalleryItem}
              variant="primary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer relative rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={getImageUrl(item.imageUrl)}
                    alt={item.caption || "Event image"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Caption overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    {item.caption && (
                      <p className="text-white text-xs line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {/* Quick action buttons on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm("Are you sure you want to delete this image?")
                        ) {
                          handleDeleteGalleryItem(item.id);
                        }
                      }}
                      aria-label="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Lightbox Gallery */}
      {lightboxOpen && currentImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top toolbar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-10">
            <div className="text-white text-sm">
              {currentImageIndex + 1} of {galleryItems.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(!showInfo);
                }}
                aria-label={showInfo ? "Hide info" : "Show info"}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentImage) {
                    const link = document.createElement("a");
                    link.href = getImageUrl(currentImage.imageUrl);
                    link.download = `event-image-${currentImage.id}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                aria-label="Download image"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    currentImage &&
                    confirm("Are you sure you want to delete this image?")
                  ) {
                    handleDeleteGalleryItem(currentImage.id);
                  }
                }}
                disabled={isDeleting}
                aria-label="Delete image"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="relative max-w-4xl w-full h-[70vh] px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full flex items-center justify-center">
              <Image
                src={getImageUrl(currentImage.imageUrl)}
                alt={currentImage.caption || "Gallery image"}
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Caption */}
          {showInfo && currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 animate-in slide-in-from-bottom">
              <p className="text-white text-center max-w-xl mx-auto">
                {currentImage.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
