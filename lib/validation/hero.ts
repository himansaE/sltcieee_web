import { z } from "zod";

export const CTAButtonStyleEnum = z.enum(["PRIMARY", "SECONDARY"]);
export const HeroBackgroundTypeEnum = z.enum(["IMAGE"]);
export const HeroOverlayOpacityEnum = z.enum(["LIGHT", "MEDIUM", "DARK"]);
export const HeroContentLayoutEnum = z.enum(["LEFT", "CENTER"]);

export const CTAButtonSchema = z.object({
  text: z.string().min(1).max(40),
  url: z.string().url(),
  style: CTAButtonStyleEnum,
});

export const HeroAnnouncementSchema = z
  .object({
    internalTitle: z.string().min(1).max(120),
    headline: z.string().min(1).max(160),
    subHeadline: z.string().max(400).optional(),
    buttons: z.array(CTAButtonSchema).min(0).max(2),

    backgroundType: HeroBackgroundTypeEnum,
    // Accept either full URL or a storage key; required is enforced in superRefine
    desktopImageUrl: z
      .string()
      .min(1, { message: "Desktop image is required" })
      .optional(),
    imageAlt: z.string().max(160).optional(),
  // gradient removed
    overlay: HeroOverlayOpacityEnum.default("MEDIUM"),
    contentLayout: HeroContentLayoutEnum.default("LEFT"),

    countdownEnabled: z.boolean().default(false),
    countdownTo: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.coerce.date().optional()
    ),
    countdownLabel: z.string().max(80).optional(),

    badgeEnabled: z.boolean().default(false),
    badgeText: z.string().max(40).optional(),

    scheduleEnabled: z.boolean().default(false),
    startAt: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.coerce.date().optional()
    ),
    endAt: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.coerce.date().optional()
    ),
  })
  .superRefine((val, ctx) => {
    if (val.backgroundType === "IMAGE") {
      if (!val.desktopImageUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Desktop image is required",
          path: ["desktopImageUrl"],
        });
      }
      if (!val.imageAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image alt text is required for accessibility",
          path: ["imageAlt"],
        });
      }
  }

    if (val.countdownEnabled && !val.countdownTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Countdown date/time is required when countdown is enabled",
        path: ["countdownTo"],
      });
    }

    if (val.badgeEnabled && !val.badgeText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Badge text is required when badge is enabled",
        path: ["badgeText"],
      });
    }

    if (val.scheduleEnabled) {
      if (!val.startAt || !val.endAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start and end datetime are required when scheduling",
          path: ["startAt"],
        });
      } else if (val.endAt <= val.startAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["endAt"],
        });
      }
    }
  });

export type HeroAnnouncementInput = z.infer<typeof HeroAnnouncementSchema>;
export type CTAButtonInput = z.infer<typeof CTAButtonSchema>;
