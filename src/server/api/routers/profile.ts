import { z } from "zod";
import { Ship } from "@prisma/client";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { PlayerShipSprites, getLevelUpCost } from "~/utils/ships";
import { chooseEquipmentType, getNewEquipment } from "~/utils/equipment";

export const profileRouter = createTRPCRouter({
    // queries:
    // done - get profile (prisma.player)
    // done - get ships
    // done - get equipment
    // leaderboards - unprotected?
    getProfile: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        let profile = ctx.prisma.player.findUnique({
            where: {
                userId: userId,
            },
            include: {
                ships: {
                    include: {
                        equipment: true,
                    },
                },
                equipment: true,
            },
        });
        return profile;
    }),

    getPlayerShips: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        const ships = ctx.prisma.player.findUnique({
            where: {
                userId: userId,
            },
            select: {
                ships: true,
            },
        });
        return ships;
    }),

    getPlayerEquipment: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        const ships = ctx.prisma.player.findUnique({
            where: {
                userId: userId,
            },
            select: {
                equipment: true,
            },
        });
        return ships;
    }),

    getPlayerCurrentShip: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        const currentShip = ctx.prisma.player.findFirst({
            where: {
                userId: userId,
            },
            select: {
                ships: {
                    where: {
                        isCurrent: true,
                    },
                    include: {
                        equipment: true,
                    },
                },
            },
        });

        return currentShip;
    }),

    // mutations:
    // DONE - create new profile with base ship
    // DONE - update wave count
    // DONE - update credits
    // update materials
    // update ship (iscurrent, equipment)
    // update inventory
    createNewProfile: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(({ ctx, input }) => {
            const userId = ctx.session!.user.id;
            const profile = ctx.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    profile: {
                        create: {
                            name: input.name,
                            waves: 0,
                            credits: 1000,
                            ships: {
                                create: {
                                    health: 2000,
                                    level: 0,
                                    bulletRange: 500,
                                    bulletDamage: 50,
                                    bulletSpeed: 300,
                                    shootDelay: 300,
                                    shield: 10,
                                    battery: 3,
                                    sprite: PlayerShipSprites.base,
                                    isCurrent: true,
                                },
                            },
                        },
                    },
                },
            });
            console.log(profile);
            return profile;
        }),

    updateWaveCount: protectedProcedure
        .input(z.object({ amount: z.number() }))
        .mutation(({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const waves = ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    waves: { increment: input.amount },
                },
            });

            return waves;
        }),

    // not sure I want this, maybe done through wave completion/purchases
    updateCredits: protectedProcedure
        .input(z.object({ amount: z.number() }))
        .mutation(({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const player = ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    credits: { increment: input.amount },
                },
            });

            return player;
        }),

    // input old and new ship IDs, determine id verification needed
    updateCurrentShip: protectedProcedure
        .input(z.object({ oldShipId: z.number(), newShipId: z.number() }))
        .mutation(({ ctx, input }) => {
            // need to add verification of ownership
            const userId = ctx.session.user.id;
            const oldShip = ctx.prisma.ship.update({
                where: {
                    id: input.oldShipId,
                },
                data: {
                    isCurrent: false,
                },
            });
            const newShip = ctx.prisma.ship.update({
                where: {
                    id: input.newShipId,
                },
                data: {
                    isCurrent: true,
                },
            });

            const updatedShip = ctx.prisma.ship.findUnique({
                where: {
                    id: input.newShipId,
                },
                include: {
                    equipment: true,
                },
            });

            return updatedShip;
        }),

    updateShipEquipment: protectedProcedure
        .input(
            z.object({
                playerId: z.number(),
                shipId: z.number(),
                equipmentIdRemove: z.number().optional(),
                equipmentIdAdd: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: check battery requirements
            // TODO: check slot type available
            // verify player owns equipment
            if (input.equipmentIdRemove) {
                const verifiedOld = await ctx.prisma.equipment.count({
                    where: {
                        playerId: input.playerId,
                        id: input.equipmentIdRemove,
                    },
                });
                if (verifiedOld == 0) {
                    return "equipment to remove not owned";
                }
            }
            const verifiedNew = await ctx.prisma.equipment.count({
                where: {
                    playerId: input.playerId,
                    id: input.equipmentIdAdd,
                },
            });
            if (verifiedNew == 0) {
                return "equipment to add not owned";
            }
            let updatedShip;
            if (input.equipmentIdRemove) {
                updatedShip = await ctx.prisma.ship.update({
                    where: {
                        id: input.shipId,
                    },
                    data: {
                        equipment: {
                            disconnect: { id: input.equipmentIdRemove },
                            connect: { id: input.equipmentIdAdd },
                        },
                    },
                });
            } else {
                updatedShip = await ctx.prisma.ship.update({
                    where: {
                        id: input.shipId,
                    },
                    data: {
                        equipment: {
                            connect: { id: input.equipmentIdAdd },
                        },
                    },
                });
            }

            return updatedShip;
        }),

    shipLevelUp: protectedProcedure
        .input(z.object({ shipId: z.number(), playerId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const currentCredits = await ctx.prisma.player.findUnique({
                where: {
                    userId: userId,
                },
                select: {
                    credits: true,
                },
            });
            const currentShip = await ctx.prisma.ship.findUnique({
                where: {
                    id: input.shipId,
                },
            });
            const cost = getLevelUpCost(currentShip!.level, 1);

            if (cost <= currentCredits!.credits) {
                const updateShipLvl = await ctx.prisma.player.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        credits: { increment: -cost },
                        ships: {
                            update: {
                                where: {
                                    id: input.shipId,
                                },
                                data: {
                                    level: { increment: 1 },
                                },
                            },
                        },
                    },
                });

                const player = ctx.prisma.player.findUnique({
                    where: {
                        userId: userId,
                    },
                    include: {
                        ships: {
                            include: {
                                equipment: true,
                            },
                        },
                    },
                });

                return player;
            } else {
                return "Not enough credits";
            }
        }),

    getRandomT1Equipment: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const equipmentType = chooseEquipmentType();
        const newEquipment = getNewEquipment(equipmentType, "T1");

        const updateInventory = await ctx.prisma.player.update({
            where: {
                userId: userId,
            },
            data: {
                equipment: {
                    create: {
                        sprite: equipmentType,
                        type: equipmentType,
                        level: 0,
                        bulletDamage: newEquipment.damage,
                        bulletRange: newEquipment.range,
                        bulletSpeed: newEquipment.speed,
                        shootDelay: newEquipment.delay,
                        shield: newEquipment.shield,
                        health: newEquipment.health,
                        battery: newEquipment.battery,
                    },
                },
            },
            include: {
                equipment: true,
            },
        });
        return updateInventory.equipment[updateInventory.equipment.length - 1];
    }),
});
