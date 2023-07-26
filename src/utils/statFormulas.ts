import { PlayerEquipment } from "./gameTypes";

export enum ShipConstants {
    hpPerLevel = 10,
    shieldPerLevel = 0.1,
    damagePerLevel = 0.1,
    shootDelayDivisor = 100,
    shieldStatDivisor = 10,
    shieldDamageDivisor = 1000,
}

export const getShipStats = (
    level: number,
    baseHP: number,
    baseShield: number,
    baseDamage: number,
    baseSpeed: number,
    baseDelay: number,
    baseRange: number,
    battery: number
) => {
    const health = baseHP + level * ShipConstants.hpPerLevel;
    const shield =
        baseShield *
        (1 +
            (level * ShipConstants.shieldPerLevel) /
                ShipConstants.shieldStatDivisor);
    const damage = baseDamage * (1 + level * ShipConstants.damagePerLevel);
    const speed = baseSpeed;
    const interval = baseDelay;
    const range = baseRange;
    const maxBattery = battery;

    return { health, shield, damage, speed, interval, range, maxBattery };
};

export const getEquipmentStats = (
    level: number,
    baseHP: number,
    baseShield: number,
    baseDamage: number,
    baseSpeed: number,
    baseDelay: number,
    baseRange: number,
    batteryUsage: number
) => {
    const health = baseHP + baseHP * level;
    const shield = baseShield + baseShield * level;
    const damage = baseDamage + baseDamage * level;
    const speed = baseSpeed + baseSpeed * level;
    const interval = baseDelay + baseDelay * level;
    const range = baseRange + baseRange * level;

    return { health, shield, damage, speed, interval, range, batteryUsage };
};

export const getShipWithEquipmentStats = (
    level: number,
    baseHP: number,
    baseShield: number,
    baseDamage: number,
    baseSpeed: number,
    baseDelay: number,
    baseRange: number,
    baseBattery: number,
    equipment: PlayerEquipment[]
) => {
    let { health, shield, damage, speed, interval, range, maxBattery } =
        getShipStats(
            level,
            baseHP,
            baseShield,
            baseDamage,
            baseSpeed,
            baseDelay,
            baseRange,
            baseBattery
        );
    let batteryUsage = 0;
    equipment.forEach((e) => {
        const eStat = getEquipmentStats(
            e.level,
            e.health,
            e.shield,
            e.bulletDamage,
            e.bulletSpeed,
            e.shootDelay,
            e.bulletRange,
            e.battery
        );
        health += eStat.health;
        shield += eStat.shield;
        damage += eStat.damage;
        speed += eStat.speed;
        interval += eStat.interval;
        range += eStat.range;
        batteryUsage += eStat.batteryUsage;
    });

    return {
        health,
        shield,
        damage,
        speed,
        interval,
        range,
        maxBattery,
        batteryUsage,
    };
};
