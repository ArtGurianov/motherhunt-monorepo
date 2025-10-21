"use client";

import { Button } from "@shared/ui/components/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] w-full max-w-md flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-red-100 p-4">
          <svg
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold">{'Something went wrong'}</h2>

        <p className="text-muted-foreground max-w-sm">
          {'We encountered an unexpected error. This has been logged and we will look into it.'}
        </p>

        {error.message && (
          <details className="w-full cursor-pointer rounded-base border-2 border-border bg-secondary p-4 text-left">
            <summary className="font-mono text-sm font-semibold">
              {'Error details'}
            </summary>
            <pre className="mt-2 overflow-x-auto text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          {'Try again'}
        </Button>
        <Button
          onClick={() => window.location.href = "/"}
          variant="secondary"
        >
          {'Go home'}
        </Button>
      </div>
    </div>
  );
}
