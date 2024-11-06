import type { NextRequest } from "next/server";
type formDataReaderReturnType = {
  formData: FormData | null;
  error: string | null;
};
export const formDataReader = async (
  req: NextRequest
): Promise<formDataReaderReturnType> => {
  try {
    const formData = await req.formData();
    return {
      formData,
      error: null,
    };
  } catch (e) {
    console.error("Error reading form data: ", e);
    return {
      formData: null,
      error: "Error reading form data",
    };
  }
};
