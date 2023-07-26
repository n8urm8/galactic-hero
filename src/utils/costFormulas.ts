import type { Equipment } from "@prisma/client";
// TODO: add in cost formula based on level and rarity
export const getEquipmentLevelUpCost = (equipment: Equipment) => {
    return 100;
};
