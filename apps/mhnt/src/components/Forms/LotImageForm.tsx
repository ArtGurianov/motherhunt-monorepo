"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { cn } from "@shared/ui/lib/utils";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const LotImageSchema = z.object({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) => !file || file.size !== 0 || file.size <= 1024 * 1024 * 10,
      {
        message: "Max size exceeded",
      }
    ),
});

export const LotImageForm = ({
  currentImageUrl,
}: {
  currentImageUrl: string;
}) => {
  const { handleSubmit, control } = useForm<z.infer<typeof LotImageSchema>>({
    resolver: zodResolver(LotImageSchema),
  });

  const onSubmit = (data: z.infer<typeof LotImageSchema>) => {
    console.log("SUBMITTED");
    console.log(data);
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

  return (
    <div className="w-full flex gap-4">
      <div
        className={cn(
          "flex-1 grow aspect-3/4 relative border-2 border-dashed transition-colors duration-200 ease-in-out rounded-4xl",
          isDragActive
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
          {isDragActive ? (
            <p className="text-center px-4">{"Drop the files here..."}</p>
          ) : (
            <div className="flex items-center justify-center h-full w-full gap-3">
              <div className="relative text-center">
                <p className="text-center px-4">
                  {"Drop image or click to select file..."}
                </p>
                <div className="flex justify-center items-center absolute -bottom-full w-full">
                  <Button
                    className="[&_svg]:size-6"
                    size="sm"
                    variant="secondary"
                  >
                    <Upload className="mr-2" />
                    {"Select Image"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="relative flex-1 grow aspect-3/4 rounded-4xl">
        <Image
          src={currentImageUrl}
          alt="Model image url"
          width="0"
          height="0"
          sizes="100vh"
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );
};
