import Request from "../http";

export const uploadFile = async ({
  buffer,
  key,
}: {
  buffer: Blob;
  key: string;
}) => {
  const formData = new FormData();
  formData.append("file", buffer, key);

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

  console.log(req.data);
  if (req.data.success !== true) {
    throw new Error("File upload failed");
  }
  return req.data;
};
