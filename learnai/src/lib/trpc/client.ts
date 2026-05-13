// ─── tRPC v11 client setup ────────────────────────────────────────────────────
// Uses the new @trpc/tanstack-react-query integration (recommended over @trpc/react-query).
// See: https://trpc.io/docs/client/tanstack-react-query/setup
//
// FIX #9: removed the incorrect `queryClient: null as any` pattern.
// The tRPC proxy does NOT take a queryClient — you pass it to TanStack Query hooks directly.
// createTRPCOptionsProxy produces QueryOptions/MutationOptions factories, not hooks.
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/routers/_app";

function getBaseUrl(): string {
  // Browser
  if (typeof window !== "undefined") return window.location.origin;

  // Vercel preview deployments
  if (process.env.VERCEL_URL) {
    const v = process.env.VERCEL_URL;
    return v.startsWith("http") ? v : `https://${v}`;
  }

  // Explicit app URL (required in production)
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // Development fallback
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";

  throw new Error(
    "Unable to determine the app base URL. Set NEXT_PUBLIC_APP_URL or VERCEL_URL in your environment."
  );
}

// ─── Vanilla tRPC client (server-side usage, direct calls) ───────────────────
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

// ─── TanStack React Query proxy ───────────────────────────────────────────────
// Use this to generate QueryOptions and then pass them to React Query hooks:
//
//   // In a Client Component:
//   const queryClient = useQueryClient();
//   const { data } = useQuery(trpc.course.getAll.queryOptions({ limit: 6 }));
//
//   // In a Server Component (prefetch pattern):
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(trpc.course.getFeatured.queryOptions());
//
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
});
