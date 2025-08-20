"use client";

import { useAppKit } from "@reown/appkit/react";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

export const withWeb3ConnectBtn = <T extends GetComponentProps<typeof Button>>(
  component: FC<T>
): FC<T> => {
  const WithWeb3ConnectBtn = (props: T) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [awaitingClickEvent, setAwaitingClickEvent] =
      useState<MouseEvent<HTMLButtonElement> | null>(null);
    const { isConnected } = useAccount();
    const { open } = useAppKit();

    useEffect(() => {
      if (isConnected && awaitingClickEvent) {
        props.onClick?.(awaitingClickEvent);
        setAwaitingClickEvent(null);
      }
    }, [awaitingClickEvent, isConnected]);

    const Cmp = component;
    Cmp.displayName = "Button";
    return (
      <Cmp
        {...props}
        ref={buttonRef}
        onClick={(e) => {
          if (isConnected) {
            props.onClick?.(e);
          } else {
            e.preventDefault();
            setAwaitingClickEvent(e);
            open({ view: "Connect" });
          }
        }}
      />
    );
  };

  WithWeb3ConnectBtn.displayName = "WithWeb3ConnectBtn";

  return WithWeb3ConnectBtn;
};
