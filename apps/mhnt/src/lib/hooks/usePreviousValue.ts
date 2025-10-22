import { useEffect, useRef } from "react";

export const usePreviousValue = <TValue>(
  value?: TValue,
): TValue | undefined => {
  const prevValue = useRef<TValue | undefined>(undefined);

  useEffect(() => {
    prevValue.current = value;

    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
};
