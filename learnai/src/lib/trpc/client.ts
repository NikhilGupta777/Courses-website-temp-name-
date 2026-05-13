// ─── tRPC v11+ uses @trpc/tanstack-react-query (not @trpc/react-query) ────────
// See: https://trpc.io/blog/introducing-tanstack-react-query-client
// The classic @trpc/react-query still works but is deprecated for new projects.
// We use the new integration which is more TanStack Query-native.
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/routers/_app";

// Vanilla client for server-side usage and direct calls
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/trpc`,
    }),
  ],
});

// TanStack React Query proxy — use this in React components
// Usage: const { data } = useSuspenseQuery(trpc.course.getAll.queryOptions({ limit: 10 }));
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: null as any, // Provided by TRPCProvider at runtime
});
