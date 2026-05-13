// ─── tRPC v11 client setup ────────────────────────────────────────────────────
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@/server/routers/_app";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) {
    const v = process.env.VERCEL_URL;
    return v.startsWith("http") ? v : `https://${v}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error("Unable to determine the app base URL. Set NEXT_PUBLIC_APP_URL or VERCEL_URL.");
}

// ─── Vanilla tRPC client (server-side usage, direct calls) ───────────────────
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

// ─── Shared QueryClient singleton ────────────────────────────────────────────
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } },
    });
  }
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } },
    });
  }
  return browserQueryClient;
}

// ─── TanStack React Query proxy ───────────────────────────────────────────────
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: getQueryClient,
});
