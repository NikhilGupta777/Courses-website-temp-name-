// ─── tRPC v11+ uses @trpc/tanstack-react-query (not @trpc/react-query) ────────
// See: https://trpc.io/blog/introducing-tanstack-react-query-client
// The classic @trpc/react-query still works but is deprecated for new projects.
// We use the new integration which is more TanStack Query-native.
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/routers/_app";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  throw new Error(
    "Unable to determine the application base URL on the server. Set NEXT_PUBLIC_APP_URL or VERCEL_URL."
  );
}

// Vanilla client for server-side usage and direct calls
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

// TanStack React Query proxy — use this in React components
// Usage: const { data } = useSuspenseQuery(trpc.course.getAll.queryOptions({ limit: 10 }));
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: null as any, // Provided by TRPCProvider at runtime
});
