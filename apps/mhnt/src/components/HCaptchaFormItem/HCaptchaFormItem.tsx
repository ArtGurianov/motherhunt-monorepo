"use client";

import { getEnvConfigClient } from "@/lib/config/env";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { FormControl, FormItem, FormMessage } from "@shared/ui/components/form";
import { LoaderCircle } from "lucide-react";
import { RefObject } from "react";

interface HCaptchaFormItemProps {
  ref: RefObject<HCaptcha | null>;
  onSuccess: (_: string) => void;
}

export const HCaptchaFormItem = ({ ref, onSuccess }: HCaptchaFormItemProps) => {
  const envConfig = getEnvConfigClient();

  const onLoad = () => {
    ref.current?.execute();
  };

  return (
    <FormItem>
      <FormControl>
        <div className="relative h-24 w-full border-2 rounded-lg bg-secondary">
          <LoaderCircle className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 animate-spin" />
          <div className="absolute flex justify-center items-center z-10 w-full h-full">
            <HCaptcha
              sitekey={
                envConfig.NODE_ENV === "production"
                  ? envConfig.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
                  : "10000000-ffff-ffff-ffff-000000000001"
              }
              onLoad={onLoad}
              onVerify={onSuccess}
              ref={ref}
            />
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
