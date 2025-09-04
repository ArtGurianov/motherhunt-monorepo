"use client";

import { getCloudinarySignature } from "@/actions/getCloudinarySignature";
import { updateDraft } from "@/actions/updateDraft";
import { getEnvConfigClient } from "@/lib/config/env";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { cn } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { LoaderCircle, Upload } from "lucide-react";
import { AppImage } from "../AppImage/AppImage";
import { useCallback, useTransition } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const lotImageSchema = z.object({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) => !file || file.size !== 0 || file.size <= 1024 * 1024 * 10,
      {
        message: "Max size exceeded",
      }
    ),
});

const cloudinaryResSchema = z.object({
  secure_url: z.string(),
});

export const LotImageForm = ({
  lotId,
  currentImageUrl,
}: {
  lotId: string;
  currentImageUrl: string;
}) => {
  const envConfig = getEnvConfigClient();
  const [isTransitionPending, startTransition] = useTransition();

  const { handleSubmit, control } = useForm<z.infer<typeof lotImageSchema>>({
    resolver: zodResolver(lotImageSchema),
  });

  const onSubmit = (data: z.infer<typeof lotImageSchema>) => {
    startTransition(async () => {
      try {
        const result = await getCloudinarySignature();
        if (!result.success) {
          toast(result.errorMessage);
          return;
        }
        const formData = new FormData();
        formData.append("file", data.image);
        formData.append("folder", "images");
        formData.append("upload_preset", "profile_picture");
        formData.append("timestamp", result.data.timestamp.toString());
        formData.append("api_key", envConfig.NEXT_PUBLIC_CLOUDINARY_PUBLIC_KEY);
        formData.append("signature", result.data.signature);
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${envConfig.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const cloudinaryJsonData = await cloudinaryRes.json();
        const validationResult =
          cloudinaryResSchema.safeParse(cloudinaryJsonData);
        if (!validationResult.success)
          throw new AppClientError("Uploading failed. Try again later.");
        const updatedResult = await updateDraft({
          lotId,
          updateData: { profilePictureUrl: validationResult.data.secure_url },
        });
        if (!updatedResult.success)
          throw new AppClientError(
            "Failed while updating Lot data. Try again later"
          );
        toast("Success");
      } catch (error) {
        toast(formatErrorMessage(error));
      }
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onSubmit({ image: acceptedFiles[0]! });
    }
  };

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    if (!rejections.length) return;
    console.log(rejections[0]);
    const unsupportedFormat = rejections.find(
      (each) => each.errors[0]?.code === "file-invalid-type"
    );
    const tooManyFiles = rejections.find(
      (each) => each.errors[0]?.code === "too-many-files"
    );
    const sizeTooLarge = rejections.find(
      (each) => each.errors[0]?.code === "file-too-large"
    );

    if (unsupportedFormat) toast.error("Unsupported file format");
    if (tooManyFiles) toast.error("Too many files");
    if (sizeTooLarge) toast.error("File size exceeds 10 MB");
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10, // 10MB,
    accept: {
      "image/*": [],
    },
  });

  let displayDropzone = (
    <div className="flex items-center justify-center h-full w-full gap-3">
      <div className="relative text-center">
        <p className="text-center px-4">
          {"Drop image or click to select file..."}
        </p>
        <div className="flex justify-center items-center absolute -bottom-full w-full">
          <Button className="[&_svg]:size-6" size="sm" variant="secondary">
            <Upload className="mr-2" />
            {"Select Image"}
          </Button>
        </div>
      </div>
    </div>
  );
  if (isDragActive) {
    displayDropzone = (
      <p className="text-center px-2">{"Drop the files here..."}</p>
    );
  }
  if (isTransitionPending) {
    displayDropzone = (
      <p className="text-center px-2">
        <LoaderCircle className="animate-spin h-8 w-8 mr-2 inline-block" />
        {"UPLOADING..."}
      </p>
    );
  }

  return (
    <div className="w-full flex gap-4">
      <div
        className={cn(
          "flex-1 grow aspect-3/4 relative border-2 border-dashed transition-colors duration-200 ease-in-out rounded-4xl",
          isDragActive || isTransitionPending
            ? "border-secondary bg-secondary/10 border-solid"
            : "border-accent-foreground hover:border-primary"
        )}
        {...getRootProps()}
      >
        <form
          className="flex flex-col h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="image"
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => {
              const {
                onBlur: onDropzoneInputBlur,
                onChange: onDropzoneInputChange,
                ...restDropzoneInputProps
              } = getInputProps();
              return (
                <input
                  type="file"
                  ref={ref}
                  accept="image/*"
                  name={name}
                  onBlur={(e) => {
                    onBlur();
                    onDropzoneInputBlur?.(e);
                  }}
                  onChange={(e) => {
                    onChange(e);
                    onDropzoneInputChange?.(e);
                  }}
                  {...restDropzoneInputProps}
                />
              );
            }}
          />
          {displayDropzone}
        </form>
      </div>
      <div className="relative flex-1 grow aspect-3/4 rounded-4xl overflow-clip">
        <AppImage
          src={currentImageUrl}
          alt="Model image url"
          width="0"
          height="0"
          sizes="100vh"
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
};
