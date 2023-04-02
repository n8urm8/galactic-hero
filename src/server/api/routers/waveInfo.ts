import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getEliteEnemy, getNormalEnemy, getTankEnemy } from "~/utils/enemies";

export const waveInfoRouter = createTRPCRouter({
    // normally need to use session user to get wave number from db
    getWaveEnemies: publicProcedure
    .input(z.object({ width: z.number() }))
    .query(({ input }) => {
        const width = input.width
        let enemies = [getTankEnemy(width), getNormalEnemy(width), getEliteEnemy(width)]
        
        return enemies
    }),


});
