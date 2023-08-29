import { createTRPCRouter } from "~/server/api/trpc";
import { waveInfoRouter } from "./routers/waveInfo";
import { profileRouter } from "./routers/profile";
import { craftingRouter } from "./routers/crafting";
import { vanguardRouter } from "./routers/vanguard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    waveInfo: waveInfoRouter,
    profile: profileRouter,
    crafting: craftingRouter,
    vanguard: vanguardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
