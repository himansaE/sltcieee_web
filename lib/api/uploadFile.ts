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
    message: string;
    filename: string;
  }>({
    method: "POST",
    url: "/api/admin/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (req.data.message !== "Success") {
    throw new Error("File upload failed");
  }
  return req.data;
};
