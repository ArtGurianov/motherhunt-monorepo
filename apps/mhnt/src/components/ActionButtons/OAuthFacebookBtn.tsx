"use client";

import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";

export const OAuthFacebookBtn = (props: GetComponentProps<typeof Button>) => {
  return (
    <Button {...props} disabled>
      {"FB Sign In"}
    </Button>
  );
};
