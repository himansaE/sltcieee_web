import { Event } from "@prisma/client";

type EventGallerySectionProps = {
  event: Event;
};
export const EventGallerySection: React.FC<EventGallerySectionProps> = ({}) => {
  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold">Event Gallery</h2>
      </div>
    </div>
  );
};
