"use client";

import { GetComponentProps } from "@shared/ui/lib/types";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@shared/ui/components/skeleton";

export const AppImage = (props: GetComponentProps<typeof Image>) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading ? <Skeleton className="absolute w-full h-full" /> : null}
      <Image
        {...props}
        onLoad={(e) => {
          props.onLoad?.(e);
          setIsLoading(false);
        }}
      />
    </>
  );
};
