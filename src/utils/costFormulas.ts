import type { Equipment, Ship } from "@prisma/client";
import { CraftingType, ResourcesType, Tier } from "./gameTypes";
import { shipCraftingCosts } from "./ships";
import { equipmentCraftingCosts } from "./equipment";
// TODO: add in cost formula based on level and rarity
export const getEquipmentLevelUpCost = (equipment: Equipment) => {
    const costPerLevel = 100;
    let totalCost = 0;
    for (let i = 0; i <= equipment.level; i++) {
        totalCost += (equipment.level + 1) * costPerLevel;
    }
    return totalCost;
};

export const getShipLevelUpCost = (ship: Ship) => {
    const costPerLevel = 100;
    let totalCost = 0;
    for (let i = 0; i <= ship.level; i++) {
        totalCost += (ship.level + 1) * costPerLevel;
    }

    return totalCost;
};

export const getCraftingCost = (
    type: CraftingType,
    tier: Tier
): ResourcesType => {
    const typeKeys = {
        ship: shipCraftingCosts,
        equipment: equipmentCraftingCosts,
    };
    return typeKeys[type][tier];
};

export const hasCraftingRequirements = (
    current: ResourcesType,
    required: ResourcesType
) => {
    let hasResources = true;
    Object.keys(current).forEach((res, i) => {
        if (current[res] < required[res]) {
            hasResources = false;
        }
    });

    return hasResources;
};
