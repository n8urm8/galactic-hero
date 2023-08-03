import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getCraftingCost, hasCraftingRequirements } from "~/utils/costFormulas";
import { chooseEquipmentType, getNewEquipment } from "~/utils/equipment";
import { CraftingType, ResourcesType, Tier } from "~/utils/gameTypes";
import { getCurrentPlayer } from "~/utils/prismaHelpers";
import { craftShip } from "~/utils/ships";

export const craftingRouter = createTRPCRouter({
    craftShipOrEquipment: protectedProcedure
        .input(z.object({ type: z.string(), tier: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const currentUser = await getCurrentPlayer(userId);
            const resourceCosts = getCraftingCost(
                input.type as CraftingType,
                input.tier as Tier
            );

            const canCraft = hasCraftingRequirements(
                {
                    credits: currentUser.credits,
                    metal: currentUser.craftingMaterials.metal,
                    energy: currentUser.craftingMaterials.energy,
                    gilding: currentUser.craftingMaterials.gilding,
                },
                resourceCosts
            );

            if (!canCraft) return "Missing crafting materials";

            if (input.type == "equipment") {
                const type = chooseEquipmentType();
                const newEquipment = getNewEquipment(type, input.tier as Tier);

                const equipment = await ctx.prisma.player.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        equipment: {
                            create: {
                                sprite: type,
                                type: type,
                                level: 0,
                                bulletDamage: newEquipment.damage,
                                bulletRange: newEquipment.range,
                                bulletSpeed: newEquipment.speed,
                                shootDelay: newEquipment.delay,
                                shield: newEquipment.shield,
                                health: newEquipment.health,
                                battery: newEquipment.battery,
                                rarity: input.tier,
                            },
                        },
                        credits: { increment: -resourceCosts.credits },
                        craftingMaterials: {
                            update: {
                                energy: { increment: -resourceCosts.energy },
                                gilding: { increment: -resourceCosts.gilding },
                                metal: { increment: -resourceCosts.metal },
                            },
                        },
                    },
                    include: {
                        equipment: true,
                    },
                });

                return equipment.equipment[equipment.equipment.length - 1];
            } else {
                const newShip = craftShip(input.tier as Tier);
                const ship = await ctx.prisma.player.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        ships: {
                            create: {
                                health: newShip.health,
                                level: 0,
                                bulletRange: newShip.bulletRange,
                                bulletDamage: newShip.bulletDamage,
                                bulletSpeed: newShip.bulletSpeed,
                                shootDelay: newShip.shootDelay,
                                shield: newShip.shield,
                                battery: newShip.battery,
                                sprite: newShip.sprite,
                                isCurrent: false,
                                rarity: input.tier,
                            },
                        },
                        credits: { increment: -resourceCosts.credits },
                        craftingMaterials: {
                            update: {
                                energy: { increment: -resourceCosts.energy },
                                gilding: { increment: -resourceCosts.gilding },
                                metal: { increment: -resourceCosts.metal },
                            },
                        },
                    },
                    include: {
                        ships: true,
                    },
                });

                return ship.ships[ship.ships.length - 1];
            }
        }),
});
