import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { getEliteEnemy, getNormalEnemy, getTankEnemy } from "~/utils/enemies";
import {
    getWaveCraftingReward,
    getWaveCreditReward,
} from "~/utils/rewardFormulas";

export const waveInfoRouter = createTRPCRouter({
    updateWaveCount: protectedProcedure
        .input(z.object({ amount: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const currentWaves = await ctx.prisma.player.findUniqueOrThrow({
                where: {
                    userId: userId,
                },
            });
            const creditReward = getWaveCreditReward(currentWaves.waves);
            const waves = await ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    waves: { increment: input.amount },
                    credits: { increment: creditReward },
                },
            });
            const craftingRewards = getWaveCraftingReward(currentWaves.waves);
            if (craftingRewards.metal > 0) {
                const craftingMaterials =
                    await ctx.prisma.craftingMaterials.upsert({
                        where: {
                            playerId: currentWaves.id,
                        },
                        update: {
                            energy: { increment: craftingRewards.energy },
                            metal: { increment: craftingRewards.metal },
                            gilding: { increment: craftingRewards.gilding },
                        },
                        create: {
                            player: { connect: { id: currentWaves.id } },
                            energy: craftingRewards.energy,
                            metal: craftingRewards.metal,
                            gilding: craftingRewards.gilding,
                        },
                    });
            }

            return { waves, creditReward, craftingRewards };
        }),

    waveRankings: publicProcedure.query(async ({ ctx }) => {
        const playerRankings = await ctx.prisma.player.findMany({
            select: {
                name: true,
                waves: true,
            },
            orderBy: {
                waves: "desc",
            },
        });

        return playerRankings;
    }),

    // WIP, just find player from general rankings for now
    // playerWaveRanking: publicProcedure.query(async ({ ctx }) => {
    //     const userId = ctx.session.user.id;
    //     const playerRank = await ctx.prisma.$queryRaw`
    //                 SELECT
    //                 waves,
    //                 RANK() OVER (ORDER BY waves DESC) as rank
    //                 FROM
    //                 Player
    //                 WHERE
    //                 userId = ${userId}
    //           `;

    //     return playerRank;
    // }),
});
