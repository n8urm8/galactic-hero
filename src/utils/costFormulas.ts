import type { Equipment, Ship } from "@prisma/client";
// TODO: add in cost formula based on level and rarity
export const getEquipmentLevelUpCost = (equipment: Equipment) => {
    return 100;
};

export const getShipLevelUpCost = (ship: Ship) => {
    const costPerLevel = 100;
    let totalCost = (ship.level + 1) * costPerLevel;

    return totalCost;
};
