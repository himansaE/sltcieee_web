import { uploadFile } from "@/lib/api/uploadFile";
import { getImageUrl } from "@/lib/utils";

export const imageUpload = async (file: File) => {
  const res = await uploadFile({ buffer: file, key: file.name });
  return getImageUrl(res.filename);
};
