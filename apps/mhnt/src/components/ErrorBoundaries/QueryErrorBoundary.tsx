"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";
import { Button } from "@shared/ui/components/button";
import { getEnvConfigClient } from "@/lib/config/env";

interface QueryErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function QueryErrorFallback({ error, resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="rounded-full bg-amber-100 p-3">
          <svg
            className="h-10 w-10 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold">Unable to load data</h3>

        <p className="text-muted-foreground text-sm">
          {error.message.includes("fetch") || error.message.includes("network")
            ? "We're having trouble connecting to the server. Please check your internet connection."
            : "Something went wrong while loading this data. Please try again."}
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="w-full cursor-pointer rounded-base border-2 border-border bg-secondary p-3 text-left">
            <summary className="font-mono text-xs font-semibold">
              Error details (dev only)
            </summary>
            <pre className="mt-2 overflow-x-auto text-xs whitespace-pre-wrap break-words">
              {error.message}
              {error.stack && `\n\nStack:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>

      <Button onClick={resetErrorBoundary} variant="default" size="sm">
        Try again
      </Button>
    </div>
  );
}

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: QueryErrorFallbackProps) => ReactNode;
}

export function QueryErrorBoundary({
  children,
  fallback = QueryErrorFallback
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={fallback}
          onError={(error) => {
            if (getEnvConfigClient().NODE_ENV === "development") {
              console.error("QueryErrorBoundary caught error:", error);
            }
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
