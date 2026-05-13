"use client";

// ─── tRPC v11 + TanStack Query provider ──────────────────────────────────────
// Must wrap any component that uses trpc.*.queryOptions() or trpc.*.mutationOptions().
// See: https://trpc.io/docs/client/tanstack-react-query/setup

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type QueryErrorWithStatus = {
  data?: {
    httpStatus?: number;
  };
};

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  return (error as QueryErrorWithStatus).data?.httpStatus;
}

// Factory: create a new QueryClient per request on the server, singleton on the client
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, avoid refetching immediately on mount
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors
          const httpStatus = getHttpStatus(error);
          if (httpStatus && httpStatus >= 400 && httpStatus < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always new
    return makeQueryClient();
  }
  // Browser: reuse singleton
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // NOTE: useState ensures the QueryClient is not re-created on every render
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
