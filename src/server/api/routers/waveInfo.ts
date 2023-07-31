import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
});
