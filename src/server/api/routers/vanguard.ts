import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getCurrentPlayer } from "~/utils/prismaHelpers";
import {
    getVanguardReward,
    getWaveCraftingReward,
    getWaveCreditReward,
} from "~/utils/rewardFormulas";

export const vanguardRouter = createTRPCRouter({
    completeVanguard: protectedProcedure
        .input(z.object({ level: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const level = input.level;
            const currentPlayer = await getCurrentPlayer(userId);

            if (currentPlayer.vanguard.level < level)
                return "Vanguard Level Error";

            if (currentPlayer.vanguard.level === level) {
                const player = await ctx.prisma.player.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        vanguard: {
                            update: {
                                level: { increment: 1 },
                            },
                        },
                    },
                });
            }
            const craftingRewards = getVanguardReward(level);
            if (craftingRewards.metal > 0) {
                const craftingMaterials =
                    await ctx.prisma.craftingMaterials.upsert({
                        where: {
                            playerId: currentPlayer.id,
                        },
                        update: {
                            energy: { increment: craftingRewards.energy },
                            metal: { increment: craftingRewards.metal },
                            gilding: { increment: craftingRewards.gilding },
                        },
                        create: {
                            player: { connect: { id: currentPlayer.id } },
                            energy: craftingRewards.energy,
                            metal: craftingRewards.metal,
                            gilding: craftingRewards.gilding,
                        },
                    });
            }

            return { craftingRewards };
        }),
});
