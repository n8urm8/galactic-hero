import { getRandomInt } from "./equipment";
import { Tier } from "./gameTypes";

export enum PlayerShipSprites {
    T1 = "T1",
    T2 = "T2",
    T3 = "T3",
    T4 = "T4",
}

export type BaseShipStats = {
    health: number;
    shield: number;
    bulletDamage: number;
    bulletSpeed: number;
    bulletRange: number;
};

export const shipCraftingCosts = {
    T1: {
        credits: 1000,
        metal: 1000,
        energy: 500,
        gilding: 500,
    },
    T2: {
        credits: 10000,
        metal: 10000,
        energy: 1000,
        gilding: 1000,
    },
    T3: {
        credits: 50000,
        metal: 50000,
        energy: 2000,
        gilding: 5000,
    },
    T4: {
        credits: 100000,
        metal: 100000,
        energy: 5000,
        gilding: 10000,
    },
};

const tierMod = {
    T1: 1,
    T2: 10,
    T3: 100,
    T4: 1000,
};
const tierBattery = {
    T1: 3,
    T2: getRandomInt(3, 6),
    T3: getRandomInt(6, 10),
    T4: getRandomInt(10, 17),
};

const tierDelay = {
    T1: 0,
    T2: 10,
    T3: 20,
    T4: 100,
};
export const craftShip = (tier: Tier) => {
    return {
        health: 2000 * tierMod[tier],
        level: 0,
        bulletRange: 500,
        bulletDamage: 50 * tierMod[tier],
        bulletSpeed: 300 + tierDelay[tier],
        shootDelay: 300,
        shield: 10 * tierMod[tier],
        battery: tierBattery[tier],
        sprite: "ship1",
    };
};
