import Request from "../http";

export const uploadFile = async ({
  buffer,
  key,
  path = "images/",
}: {
  buffer: Blob;
  key: string;
  path?: string;
}) => {
  const formData = new FormData();
  formData.append("file", buffer, key);
  formData.append("path", path);

  const req = await Request<{
    filename: string;
    optimized: boolean;
    success: boolean;
  }>({
    method: "POST",
    url: "/api/admin/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (req.data.success !== true) {
    throw new Error("File upload failed");
  }
  return req.data;
};
