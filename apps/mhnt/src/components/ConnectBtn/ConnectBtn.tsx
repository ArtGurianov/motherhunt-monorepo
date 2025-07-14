"use client";

import { useAppKit } from "@reown/appkit/react";
import { Button } from "@shared/ui/components/button";

export default function ConnectButton() {
  const { open } = useAppKit();

  return (
    <Button
      onClick={() => {
        open();
      }}
    >
      {"Connect"}
    </Button>
  );
}
