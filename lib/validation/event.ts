import * as Yup from "yup";

export const eventValidationSchema = Yup.object({
  logo: Yup.mixed()
    .required("Logo is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024; // 5MB size limit
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
          (value as File).type
        )
      ); // Allow common image formats
    }),
  coverImage: Yup.mixed()
    .required("Cover image is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024; // 5MB size limit
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
          (value as File).type
        )
      ); // Allow common image formats
    }),
  title: Yup.string().required("Title is required"),
  organizationUnit: Yup.string().required("Organization unit is required"),
  description: Yup.string().required("Description is required"),
});

// extend from eventValidationSchema

export const eventReqValidationSchema = eventValidationSchema.shape({
  image: Yup.string().required(),
  logo: Yup.mixed().notRequired(),
  coverImage: Yup.string().required(),
  organizationUnit: Yup.mixed().notRequired(),
  organizationUnitId: Yup.string().required(),
});
