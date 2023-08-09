import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { getEliteEnemy, getNormalEnemy, getTankEnemy } from "~/utils/enemies";
import { getCurrentPlayer } from "~/utils/prismaHelpers";
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
            const currentTime = Date.now() / 1000;
            const creditReward = getWaveCreditReward(currentWaves.waves);
            const waves = await ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    waves: { increment: input.amount },
                    credits: { increment: creditReward },
                    lastWave: currentTime,
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

    offlineWaveRewards: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        const player = await getCurrentPlayer(userId);
        if (player.lastWave == 0) return "Not eligible for rewards yet";
        const currentTime = Date.now() / 1000;
        const afkHours = (currentTime - player.lastWave) / 3600;
        if (afkHours < 1) return "Must be afk for at least an hour";
        const afkWaves = Math.floor(afkHours * 60);
        const creditReward = getWaveCreditReward(player.waves) * afkWaves;
        const waves = await ctx.prisma.player.update({
            where: {
                userId: userId,
            },
            data: {
                waves: { increment: afkWaves },
                credits: { increment: creditReward },
                lastWave: currentTime,
            },
        });
        const craftingRewards = getWaveCraftingReward(
            Math.floor(player.waves / 10) * 10
        );
        if (craftingRewards.metal > 0) {
            const craftingMaterials = await ctx.prisma.craftingMaterials.upsert(
                {
                    where: {
                        playerId: player.id,
                    },
                    update: {
                        energy: {
                            increment:
                                craftingRewards.energy *
                                Math.floor(afkWaves / 10),
                        },
                        metal: {
                            increment:
                                craftingRewards.metal *
                                Math.floor(afkWaves / 10),
                        },
                        gilding: {
                            increment:
                                craftingRewards.gilding *
                                Math.floor(afkWaves / 10),
                        },
                    },
                    create: {
                        player: { connect: { id: player.id } },
                        energy: craftingRewards.energy,
                        metal: craftingRewards.metal,
                        gilding: craftingRewards.gilding,
                    },
                }
            );
        }

        return { afkWaves, creditReward, craftingRewards };
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
