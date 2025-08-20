"use client";

import { useAppKit, useAppKitEvents } from "@reown/appkit/react";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

export const Web3ConnectBtn = (props: GetComponentProps<typeof Button>) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isAwaitingConnection, setIsAwaitingConnection] = useState(false);
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const appKitEvent = useAppKitEvents();

  useEffect(() => {
    if (
      appKitEvent.data.event === "CONNECT_ERROR" ||
      appKitEvent.data.event === "MODAL_CLOSE"
    ) {
      setIsAwaitingConnection(false);
    }
  }, [appKitEvent]);

  useEffect(() => {
    if (isConnected && isAwaitingConnection) {
      setIsAwaitingConnection(false);
      setTimeout(() => {
        btnRef.current?.click();
      }, 0);
    }
  }, [isConnected, isAwaitingConnection]);

  return (
    <Button
      {...props}
      ref={btnRef}
      onClick={(e) => {
        if (isConnected) {
          props.onClick?.(e);
        } else {
          e.preventDefault();
          setIsAwaitingConnection(true);
          open({ view: "Connect" });
        }
      }}
    />
  );
};
