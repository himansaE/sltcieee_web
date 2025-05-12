import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEventGallery,
  addGalleryItem,
  deleteGalleryItem,
  type AddGalleryItemRequest,
} from "@/lib/api/eventGallery.Fn";

export function useEventGallery(eventId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["eventGallery", eventId];

  const {
    data: galleryItems,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getEventGallery(eventId),
  });

  const addMutation = useMutation({
    mutationFn: (data: AddGalleryItemRequest) => addGalleryItem(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => deleteGalleryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    galleryItems,
    isLoading,
    error,
    addGalleryItem: addMutation.mutateAsync,
    deleteGalleryItem: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
