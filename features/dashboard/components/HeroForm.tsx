"use client";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeroAnnouncementSchema, CTAButtonStyleEnum } from "@/lib/validation/hero";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/features/ui/imageUploader";

type FormValues = z.input<typeof HeroAnnouncementSchema>;

type HeroFormProps = { onSubmit: SubmitHandler<FormValues>; initialValues?: Partial<FormValues>; submitLabel?: string; disabled?: boolean };

export default function HeroForm({ onSubmit, initialValues, submitLabel = "Save Announcement", disabled = false }: HeroFormProps) {
  const defaults = {
    buttons: [] as any,
    backgroundType: "IMAGE" as const,
    overlay: "MEDIUM" as const,
    contentLayout: "LEFT" as const,
    countdownEnabled: false,
    badgeEnabled: false,
    scheduleEnabled: false,
    ...(initialValues || {}),
  } as unknown as FormValues;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(HeroAnnouncementSchema),
    defaultValues: defaults,
  });

  const backgroundType = watch("backgroundType");
  const countdownEnabled = watch("countdownEnabled");
  const badgeEnabled = watch("badgeEnabled");
  const scheduleEnabled = watch("scheduleEnabled");
  const buttons = watch("buttons");

  function addButton() {
    if ((buttons?.length || 0) >= 2) return;
    setValue("buttons", [ ...(buttons||[]), { text: "", url: "", style: "PRIMARY" } as any]);
  }
  function removeButton(index: number) {
    setValue("buttons", (buttons||[]).filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {JSON.stringify(errors)}
      <div>
        <label className="block text-sm font-medium">Announcement Title (internal)</label>
  <Input disabled={disabled} {...register("internalTitle")} placeholder="Q4 Workshop - AI & ML" />
        {errors.internalTitle && <p className="text-red-500 text-xs">{errors.internalTitle.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Headline</label>
  <Input disabled={disabled} {...register("headline")} placeholder="Innovate the Future" />
        {errors.headline && <p className="text-red-500 text-xs">{errors.headline.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Sub-headline / Description</label>
  <Textarea disabled={disabled} {...register("subHeadline")} placeholder="Join us on October 26th..." />
        {errors.subHeadline && <p className="text-red-500 text-xs">{errors.subHeadline.message as string}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">CTA Buttons</label>
          <Button type="button" onClick={addButton} variant="black" size="sm" disabled={disabled}>Add Button</Button>
        </div>
        <div className="space-y-3 mt-2">
          {(buttons||[]).map((btn, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-xs">Text</label>
                <Input disabled={disabled} {...register(`buttons.${i}.text` as const)} placeholder="Register Now" />
              </div>
              <div>
                <label className="block text-xs">Link</label>
                <Input disabled={disabled} {...register(`buttons.${i}.url` as const)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs">Style</label>
                <Select disabled={disabled} onValueChange={(v)=>setValue(`buttons.${i}.style` as const, v as any)} defaultValue={btn.style as any}>
                  <SelectTrigger><SelectValue placeholder="Style" /></SelectTrigger>
                  <SelectContent>
                    {CTAButtonStyleEnum.options.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="destructive" onClick={()=>removeButton(i)} disabled={disabled}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {/* Always use image background (no gradient option) */}
          <input type="hidden" value={backgroundType || "IMAGE"} {...register("backgroundType")} />

          <div className="space-y-4">
            <div>
              <label className="block text-sm">Image</label>
              <ImageUploader
                uploadPath="hero/desktop"
                initialImage={(watch("desktopImageUrl") as any) || undefined}
                onUploadComplete={(url) => setValue("desktopImageUrl", url as any, { shouldValidate: true })}
                disabled={disabled}
              />
              {errors.desktopImageUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.desktopImageUrl.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm">Image Alt Text</label>
              <Input disabled={disabled} {...register("imageAlt")} placeholder="Students at workshop" />
              {errors.imageAlt && (
                <p className="text-red-500 text-xs">{errors.imageAlt.message as string}</p>
              )}
            </div>
          </div>

          {/* Overlay and Content Layout removed per request; defaults apply server-side */}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm">Enable Countdown Timer?</label>
            <Switch
              checked={!!countdownEnabled}
              onCheckedChange={(v) => {
                setValue("countdownEnabled", v);
                if (!v) {
                  setValue("countdownTo", undefined as any, { shouldValidate: true });
                  setValue("countdownLabel", undefined as any, { shouldValidate: true });
                }
              }}
              disabled={disabled}
            />
          </div>
          {countdownEnabled && (
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs">Countdown To</label>
                <Input disabled={disabled} type="datetime-local" {...register("countdownTo" as const)} />
              </div>
              <div>
                <label className="block text-xs">Countdown Label</label>
                <Input disabled={disabled} {...register("countdownLabel")} placeholder="Event starts in:" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm">Add a Badge?</label>
            <Switch disabled={disabled} checked={!!badgeEnabled} onCheckedChange={(v)=>setValue("badgeEnabled", v)} />
          </div>
          {badgeEnabled && (
            <div>
              <label className="block text-xs">Badge Text</label>
              <Input disabled={disabled} {...register("badgeText")} placeholder="Recruiting Now" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm">Schedule this Announcement?</label>
            <Switch
              checked={!!scheduleEnabled}
              onCheckedChange={(v) => {
                setValue("scheduleEnabled", v);
                if (!v) {
                  setValue("startAt", undefined as any, { shouldValidate: true });
                  setValue("endAt", undefined as any, { shouldValidate: true });
                }
              }}
              disabled={disabled}
            />
          </div>
          {scheduleEnabled && (
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs">Start</label>
                <Input disabled={disabled} type="datetime-local" {...register("startAt" as const)} />
              </div>
              <div>
                <label className="block text-xs">End</label>
                <Input disabled={disabled} type="datetime-local" {...register("endAt" as const)} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
  <Button type="submit" variant="black" disabled={disabled}>{submitLabel}</Button>
      </div>
    </form>
  );
}
