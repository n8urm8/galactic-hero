import { z } from "zod";
import { Ship } from "@prisma/client";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { PlayerShipSprites } from "~/utils/ships";

export const profileRouter = createTRPCRouter({
  // queries: 
  // done - get profile (prisma.player)
  // done - get ships
  // done - get equipment
  // leaderboards - unprotected?
  getProfile: protectedProcedure
    .query(({ ctx }) => {
        const userId = ctx.session.user.id
        let profile = ctx.prisma.player.findUnique({
          where: {
              userId: userId
          },
          include: {
            ships: true,
            equipment: true,
          }
        })
        return profile
  }),

  getPlayerShips: protectedProcedure
    .query(({ ctx }) => {
      const userId = ctx.session.user.id
      const ships = ctx.prisma.player.findUnique({
        where: {
            userId: userId
        },
        select: {
          ships: true,
        }
      })
      return ships
    }),

    getPlayerEquipment: protectedProcedure
    .query(({ ctx }) => {
      const userId = ctx.session.user.id
      const ships = ctx.prisma.player.findUnique({
        where: {
            userId: userId
        },
        select: {
          equipment: true,
        }
      })
      return ships
    }),

  // mutations: 
  // DONE - create new profile with base ship
  // DONE - update wave count
  // DONE - update credits
  // update materials
  // update ship (iscurrent, equipment)
  // update inventory
  createNewProfile: publicProcedure
    .input( z.object({ name: z.string()}))
    .mutation(({ ctx, input}) => {
      const userId = ctx.session!.user.id
      const profile = ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          profile: {
            create: {
              name: input.name,
              waves: 0,
              credits: 1000,
              ships: {
                create: {
                  baseHP: 1000,
                  bulletRange: 500,
                  bulletDamage: 10,
                  bulletSpeed: 300,
                  shootDelay: 300,
                  shield: 10,
                  battery: 3,
                  sprite: PlayerShipSprites.base,
                  isCurrent: true,
                  weaponSlots: 1,
                  defenseSlots: 1,
                  batterySlots: 1,
                }
              }
            }
          }
        }
      })
      console.log(profile)
      return profile
    }),

    updateWaveCount: protectedProcedure
    .input( z.object({ amount: z.number()}))
    .mutation(({ ctx, input}) => {
      const userId = ctx.session.user.id
      const waves = ctx.prisma.player.update({
        where: {
          userId: userId
        },
        data: {
          waves: {increment: input.amount}
        }
      })

      return waves
    }),

    updateCredits: protectedProcedure
    .input( z.object({ amount: z.number()}))
    .mutation(({ ctx, input}) => {
      const userId = ctx.session.user.id
      const credits = ctx.prisma.player.update({
        where: {
          userId: userId
        },
        data: {
          credits: {increment: input.amount}
        }
      })

      return credits
    }),
    // input old and new ship IDs, determine id verification needed
    updateCurrentShip: protectedProcedure
    .input( z.object({ oldShipId: z.number(), newShipId: z.number() }))
    .mutation(({ ctx, input}) => {
      const userId = ctx.session.user.id
      const player = ctx.prisma.player.findUnique({
        where: {
          userId: userId
        },
        select: {
          id: true
        }
      })
      const oldShip = ctx.prisma.ship.update({
        where: {
          id: input.oldShipId
        },
        data: {
          isCurrent: false
        }
      })
      const newShip = ctx.prisma.ship.update({
        where: {
          id: input.newShipId
        },
        data: {
          isCurrent: true
        }
      })

      return newShip
    }),


});
