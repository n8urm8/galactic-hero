import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const craftingRouter = createTRPCRouter({
    updateWaveCount: protectedProcedure
        .input(z.object({ amount: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const currentWaves = await ctx.prisma.player.findUniqueOrThrow({
                where: {
                    userId: userId,
                },
                select: {
                    waves: true,
                },
            });
            const creditReward =
                currentWaves.waves * (Math.floor(currentWaves.waves / 10) + 1);
            const waves = await ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    waves: { increment: input.amount },
                    credits: { increment: creditReward },
                },
            });

            return waves;
        }),
});
