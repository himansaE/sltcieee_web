import * as Yup from "yup";

export const organizationUnitValidationSchema = Yup.object({
  title: Yup.string().required("Organization unit name is required"),
  description: Yup.string().required(
    "Organization unit description is required"
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

export const organizationUnitReqValidationSchema =
  organizationUnitValidationSchema.shape({
    logo: Yup.mixed().notRequired(),
    image: Yup.string().required(),
  });
