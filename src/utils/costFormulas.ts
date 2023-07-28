import type { Equipment, Ship } from "@prisma/client";
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
