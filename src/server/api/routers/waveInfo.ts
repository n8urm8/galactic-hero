import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getEliteEnemy, getNormalEnemy, getTankEnemy } from "~/utils/enemies";

export const waveInfoRouter = createTRPCRouter({
    // normally need to use session user to get wave number from db
    getWaveEnemies: protectedProcedure
        .input(z.object({ width: z.number(), wave: z.number() }))
        .query(({ input }) => {
            const width = input.width;
            const wave = input.wave;
            const enemies = [
                getTankEnemy(width, wave),
                getNormalEnemy(width, wave),
                getEliteEnemy(width, wave),
            ];

            return enemies;
        }),
});
