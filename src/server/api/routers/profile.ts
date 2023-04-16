import { z } from "zod";
import { Ship } from "@prisma/client";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { PlayerShipSprites, getLevelUpCost } from "~/utils/ships";

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
                  baseHP: 2000,
                  level: 1,
                  bulletRange: 500,
                  bulletDamage: 50,
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

    // not sure I want this, maybe done through wave completion/purchases
    updateCredits: protectedProcedure
    .input( z.object({ amount: z.number()}))
    .mutation(({ ctx, input}) => {
      const userId = ctx.session.user.id
      const player = ctx.prisma.player.update({
        where: {
          userId: userId
        },
        data: {
          credits: {increment: input.amount}
        }
      })

      return player
    }),

    // input old and new ship IDs, determine id verification needed
    updateCurrentShip: protectedProcedure
    .input( z.object({ oldShipId: z.number(), newShipId: z.number() }))
    .mutation(({ ctx, input}) => {
      // need to add verification of ownership
      const userId = ctx.session.user.id
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

    updateShipEquipment: protectedProcedure
      .input(z.object({ playerId: z.number(), shipId: z.number(), equipmentIdRemove: z.number().optional(), equipmentIdAdd: z.number() }))
      .mutation(async ({ctx, input}) => {
        // verify player owns equipment
        if (input.equipmentIdRemove) {
          const verifiedOld = await ctx.prisma.equipment.count({
            where: {
              playerId: input.playerId,
              id: input.equipmentIdRemove
            }
          })
          if (verifiedOld == 0) {
            return 'equipment to remove not owned'
          }
        }
        const verifiedNew = await ctx.prisma.equipment.count({
          where: {
            playerId: input.playerId,
            id: input.equipmentIdAdd
          }
        })
        if (verifiedNew == 0) {
          return 'equipment to add not owned'
        }
        let updatedShip 
        if (input.equipmentIdRemove) {
          updatedShip = await ctx.prisma.ship.update({
            where: {
              id: input.shipId,
            },
            data: {
              equipment: {
                disconnect: { id: input.equipmentIdRemove },
                connect: { id: input.equipmentIdAdd }
              }
            }
          })
        } else {
          updatedShip = await ctx.prisma.ship.update({
            where: {
              id: input.shipId,
            },
            data: {
              equipment: {
                connect: { id: input.equipmentIdAdd }
              }
            }
          })
        }

        return updatedShip
      }),

      shipLevelUp: protectedProcedure
        .input(z.object({ shipId: z.number(), playerId: z.number() }))
        .mutation( async ({ctx, input}) => {
          const userId = ctx.session.user.id
          const currentCredits = await ctx.prisma.player.findUnique({
            where: {
              userId: userId,
            },
            select: {
              credits: true
            }
          })
          const currentShip = await ctx.prisma.ship.findUnique({
            where: {
              id: input.shipId
            }
          })
          const cost = getLevelUpCost(currentShip!.level, 1)

          if (cost <= currentCredits!.credits) {
            const player = await ctx.prisma.player.update({
              where: {
                userId: userId
              },
              data: {
                credits: {increment: -cost},
                ships: {
                  update: {
                    where: {
                      id: input.shipId
                    }, 
                    data: {
                      level: { increment: 1 }
                    }
                  },
                }
              }
            })

            return player
          } else {
            return 'Not enough credits'
          }

        }),
        


});
