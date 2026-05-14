import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "@/lib/trpc/server";
import { verifyCertificate } from "@/server/services/certificate";

export const certificateRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.certificate.findMany({
      where: { userId: ctx.session.user.id },
      include: { course: { select: { title: true, slug: true } } },
      orderBy: { issuedAt: "desc" },
    });
  }),

  verify: publicProcedure
    .input(z.object({ certificateNumber: z.string() }))
    .query(async ({ input }) => {
      const cert = await verifyCertificate(input.certificateNumber);
      if (!cert) throw new TRPCError({ code: "NOT_FOUND", message: "Certificate not found" });
      return cert;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cert = await ctx.db.certificate.findUnique({
        where: { id: input.id },
        include: { course: { select: { title: true, slug: true } } },
      });
      if (!cert) throw new TRPCError({ code: "NOT_FOUND" });
      if (cert.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      return cert;
    }),
});
