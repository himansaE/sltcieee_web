import Request from "@lib/http";

export interface GalleryItemResponse {
  id: string;
  eventId: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

export interface AddGalleryItemRequest {
  imageUrl: string;
  caption?: string;
}

export const getEventGallery = async (
  eventId: string
): Promise<GalleryItemResponse[]> => {
  const res = await Request<GalleryItemResponse[]>({
    method: "get",
    url: `/api/admin/event/${eventId}/gallery`,
  });

  return res.data;
};

export const addGalleryItem = async (
  eventId: string,
  data: AddGalleryItemRequest
): Promise<GalleryItemResponse> => {
  const res = await Request<GalleryItemResponse>({
    method: "post",
    url: `/api/admin/event/${eventId}/gallery`,
    data,
  });

  return res.data;
};

export const deleteGalleryItem = async (itemId: string): Promise<void> => {
  await Request({
    method: "delete",
    url: `/api/admin/event/gallery/${itemId}`,
  });
};
