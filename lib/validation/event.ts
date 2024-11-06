import * as Yup from "yup";

export const eventValidationSchema = Yup.object({
  logo: Yup.mixed()
    .required("Event logo is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024; // 5MB size limit
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value && ["image/jpeg", "image/png"].includes((value as File).type)
      ); // Only allow jpeg or png files
    }),
  name: Yup.string().required("Event name is required"),
  title: Yup.string().required("Event title is required"),
  organizationUnit: Yup.string().required("Organization unit is required"),
  description: Yup.string().required("Event description is required"),
});
