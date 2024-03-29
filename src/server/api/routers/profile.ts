import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { PlayerShipSprites } from "~/utils/ships";
import { chooseEquipmentType, getNewEquipment } from "~/utils/equipment";
import {
    getEquipmentLevelUpCost,
    getShipLevelUpCost,
} from "~/utils/costFormulas";
import { PlayerShipWithEquipment } from "~/utils/gameTypes";
import { getBatteryIncrease } from "~/utils/statFormulas";
import { getCurrentShip, getCurrentPlayer } from "~/utils/prismaHelpers";

export const profileRouter = createTRPCRouter({
    // queries:
    // done - get profile (prisma.player)
    // done - get ships
    // done - get equipment
    // leaderboards - unprotected?
    getProfile: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        const profile = getCurrentPlayer(userId);
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
    createNewProfile: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(({ ctx, input }) => {
            const userId = ctx.session.user.id;
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
                                    sprite: PlayerShipSprites.T1,
                                    isCurrent: true,
                                },
                            },
                            craftingMaterials: {
                                create: {
                                    energy: 0,
                                    metal: 0,
                                    gilding: 0,
                                },
                            },
                            vanguard: {},
                        },
                    },
                },
            });
            console.log(profile);
            return profile;
        }),

    updateGameSession: protectedProcedure
        .input(z.object({ newSession: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const updatedSession = await ctx.prisma.player.update({
                where: {
                    userId: userId,
                },
                data: {
                    gameSession: input.newSession,
                },
            });
        }),

    // input old and new ship IDs, determine id verification needed
    updateCurrentShip: protectedProcedure
        .input(z.object({ newShipId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            // need to add verification of ownership
            const userId = ctx.session.user.id;

            const currentShip = await getCurrentShip(userId);
            const verified = await ctx.prisma.ship.count({
                where: {
                    playerId: currentShip?.playerId,
                    id: input.newShipId,
                },
            });
            if (verified == 0) return "ship not owned";
            const oldShip = await ctx.prisma.ship.update({
                where: {
                    id: currentShip?.id,
                },
                data: {
                    isCurrent: false,
                },
            });
            const newShip = await ctx.prisma.ship.update({
                where: {
                    id: input.newShipId,
                },
                data: {
                    isCurrent: true,
                },
                include: {
                    equipment: true,
                },
            });

            return newShip;
        }),

    updateShipEquipment: protectedProcedure
        .input(
            z.object({
                equipmentIdRemove: z.number().optional(),
                equipmentIdAdd: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: check battery requirements
            // verify player owns equipment
            const userId = ctx.session.user.id;
            const currentShip = await getCurrentShip(userId);
            if (currentShip == null) return "Must have ship equipped";
            const shipId = currentShip.id;
            let updatedShip;
            if (input.equipmentIdRemove) {
                const verifiedOld = await ctx.prisma.equipment.count({
                    where: {
                        playerId: currentShip.playerId,
                        id: input.equipmentIdRemove,
                    },
                });
                if (verifiedOld == 0) {
                    return "equipment to remove not owned";
                }
                updatedShip = await ctx.prisma.ship.update({
                    where: {
                        id: shipId,
                    },
                    data: {
                        equipment: {
                            disconnect: { id: input.equipmentIdRemove },
                        },
                    },
                });
            }
            if (input.equipmentIdAdd) {
                const verifiedNew = await ctx.prisma.equipment.count({
                    where: {
                        playerId: currentShip.playerId,
                        id: input.equipmentIdAdd,
                    },
                });
                if (verifiedNew == 0) {
                    return "equipment to add not owned";
                }
                // check battery requirement
                const equipment = await ctx.prisma.equipment.findUniqueOrThrow({
                    where: {
                        id: input.equipmentIdAdd,
                    },
                });

                let currentBattery = 0;
                let maxBattery = currentShip.battery;
                currentShip.equipment.forEach((item) => {
                    if (item.type != "Utility") {
                        currentBattery += item.battery;
                    } else {
                        maxBattery += getBatteryIncrease(
                            item.battery,
                            item.level
                        );
                    }
                });

                const hasBattery = currentShip.equipment.find(
                    (e) => e.type == "Utility"
                );
                if (equipment.type == "Utility") {
                    console.log("Can only have 1 battery");
                    if (hasBattery) return "Can only have 1 battery";
                } else if (currentBattery + equipment.battery > maxBattery) {
                    console.log(
                        "battery usage too high",
                        currentBattery,
                        equipment.battery,
                        maxBattery
                    );
                    return "battery usage too high";
                }

                updatedShip = await ctx.prisma.ship.update({
                    where: {
                        id: shipId,
                    },
                    data: {
                        equipment: {
                            connect: { id: input.equipmentIdAdd },
                        },
                    },
                });
            }

            return updatedShip as PlayerShipWithEquipment;
        }),

    equipmentLevelUp: protectedProcedure
        .input(z.object({ equipmentId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const currentPlayer = await getCurrentPlayer(ctx.session.user.id);
            const verified = await ctx.prisma.equipment.count({
                where: {
                    playerId: currentPlayer.id,
                    id: input.equipmentId,
                },
            });
            if (verified == 0) {
                return "equipment not owned";
            }

            // some cost associated with level
            const equipment = await ctx.prisma.equipment.findFirst({
                where: {
                    id: input.equipmentId,
                },
            });
            const levelUpCost = getEquipmentLevelUpCost(equipment);
            if (currentPlayer.credits < levelUpCost)
                return "not enough credits";

            await ctx.prisma.player.update({
                where: {
                    id: currentPlayer?.id,
                },
                data: {
                    credits: { increment: -levelUpCost },
                },
            });

            const levelUpEquipment = await ctx.prisma.equipment.update({
                where: {
                    id: input.equipmentId,
                },
                data: {
                    level: { increment: 1 },
                },
            });

            return levelUpEquipment;
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
            const currentShip = await getCurrentShip(userId);
            const cost = getShipLevelUpCost(currentShip);

            if (cost <= currentCredits.credits) {
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
});
