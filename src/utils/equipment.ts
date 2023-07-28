import { EquipmentType, Tier } from "./gameTypes";

interface IEquipment {
    health: number;
    shield: number;
    range: number;
    speed: number;
    damage: number;
    delay: number;
    battery: number;
}

const tierMod = {
    T1: 1,
    T2: 3,
    T3: 9,
    T4: 27,
};

const baseEquipment: IEquipment = {
    health: 100,
    shield: 10,
    range: 0,
    speed: 6,
    damage: 2,
    delay: 0,
    battery: 1,
};

export const getNewEquipment = (
    type: EquipmentType,
    tier: Tier
): IEquipment => {
    const newEq: IEquipment = {
        health: 0,
        shield: 0,
        range: 0,
        speed: 0,
        damage: 0,
        delay: 0,
        battery: 0,
    };
    const mod = tierMod[tier];
    console.log("tier mod: ", mod);
    console.log("equipment type: ", type);
    console.log("base equipment: ", baseEquipment);
    if (tier == "T4") newEq.delay = 100;

    if (type == "Utility") {
        console.log("went to Utility");
        newEq.health = 0;
        newEq.shield = 0;
        newEq.range = 0;
        newEq.speed = 0;
        newEq.damage = 0;
        newEq.delay = 0;
        newEq.battery =
            tier == "T1" ? 5 : tier == "T2" ? 4 : tier == "T3" ? 3 : 2;
    } else if (type == "Defensive") {
        console.log("went to Defensive");
        newEq.health = getRandomFromBase(baseEquipment.health * mod);
        newEq.shield = getRandomFromBase(baseEquipment.shield * mod);
        newEq.range = 0;
        newEq.speed = 0;
        newEq.damage = 0;
        newEq.delay = 0;
        newEq.battery =
            tier == "T1"
                ? getRandomInt(1, 2)
                : tier == "T2"
                ? getRandomInt(2, 4)
                : tier == "T3"
                ? getRandomInt(3, 6)
                : getRandomInt(4, 8);
    } else if (type == "Offensive") {
        console.log("went to Offensive");
        newEq.health = 0;
        newEq.shield = 0;
        newEq.range = 0;
        newEq.speed = getRandomFromBase(baseEquipment.speed * mod);
        newEq.damage = getRandomFromBase(baseEquipment.damage * mod);
        newEq.delay = getRandomFromBase(baseEquipment.delay * mod);
        newEq.battery =
            tier == "T1"
                ? getRandomInt(1, 2)
                : tier == "T2"
                ? getRandomInt(2, 4)
                : tier == "T3"
                ? getRandomInt(3, 6)
                : getRandomInt(4, 8);
    } else {
        console.log("type not selected properly");
    }
    console.log("final equipment: ", newEq);
    return newEq;
};

// dependent upon random number between 1 and 1000
export const chooseTier = (tierMod = 0): Tier => {
    let tier: Tier = "T1";
    const t2min = 500;
    const t3min = 750;
    const t4min = 995;

    const randomNumber = getRandomInt(1, 1000) + tierMod;
    if (randomNumber <= t2min) {
        tier = "T1";
    } else if (randomNumber <= t3min) {
        tier = "T2";
    } else if (randomNumber <= t4min) {
        tier = "T3";
    }

    return tier;
};

export const chooseEquipmentType = (): EquipmentType => {
    let selectedEquipment: EquipmentType = "Utility";
    const offensive = 50;
    const defensive = 90;

    const randomNum = getRandomInt(1, 100);
    if (randomNum <= offensive) {
        selectedEquipment = "Offensive";
    } else if (randomNum <= defensive) {
        selectedEquipment = "Defensive";
    }
    return selectedEquipment;
};

function getRandomFromBase(base: number) {
    return getRandomInt(base * 0.5, base * 1.5);
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}
