import type { Equipment, Ship } from "@prisma/client";
import { CraftingType, ResourcesType, Tier } from "./gameTypes";
import { shipCraftingCosts } from "./ships";
import { equipmentCraftingCosts } from "./equipment";
// TODO: add in cost formula based on level and rarity
const rarityMultiplier = {
    T1: 1,
    T2: 10,
    T3: 50,
    T4: 100,
};

export const getEquipmentLevelUpCost = (equipment: Equipment) => {
    const costPerLevel = 100;
    let totalCost = 0;
    for (let i = 0; i <= equipment.level; i++) {
        totalCost +=
            (equipment.level + 1) *
            costPerLevel *
            rarityMultiplier[equipment.rarity];
    }
    return totalCost;
};

export const getShipLevelUpCost = (ship: Ship) => {
    const costPerLevel = 100;
    let totalCost = 0;
    for (let i = 0; i <= ship.level; i++) {
        totalCost +=
            (ship.level + 1) * costPerLevel * rarityMultiplier[ship.rarity];
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
