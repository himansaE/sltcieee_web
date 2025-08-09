import * as Yup from "yup";

export const organizationUnitValidationSchema = Yup.object({
  title: Yup.string().required("Organization unit name is required"),
  description: Yup.string().required(
    "Organization unit description is required"
  ),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),
  logo: Yup.mixed()
    .required("Organization unit logo is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024; // 5MB size limit
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value && ["image/jpeg", "image/png"].includes((value as File).type)
      ); // Only allow jpeg or png files
    }),
});

// Create schema (no slug on create; auto-generated on server)
export const organizationUnitCreateValidationSchema = Yup.object({
  title: Yup.string().required("Organization unit name is required"),
  description: Yup.string().required(
    "Organization unit description is required"
  ),
  logo: Yup.mixed()
    .required("Organization unit logo is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value && ["image/jpeg", "image/png"].includes((value as File).type)
      );
    }),
});

export const organizationUnitReqValidationSchema =
  organizationUnitCreateValidationSchema.shape({
    // For server requests on create: logo becomes image filename
    logo: Yup.mixed().notRequired(),
    image: Yup.string().required(),
  });
