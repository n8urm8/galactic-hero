import type { IWaveEnemy } from "./gameTypes";

function getRandomStartX(width: number) {
    return getRandomInt(width / 2 - 100, width / 2 + 100);
}

// need to include wave number effect
export function getTankEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);

    const tankEnemy: IWaveEnemy = {
        health: getRandomInt(80, 120),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -50,
        shootDelay: 400,
        bulletRange: 200,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 5),
        amount: enemyAmount,
        sprite: "enemyTank",
    };

    return tankEnemy;
}

export function getNormalEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);

    const normalEnemy: IWaveEnemy = {
        health: getRandomInt(50, 100),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -100,
        shootDelay: 500,
        bulletRange: 250,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 10),
        amount: enemyAmount,
        sprite: "enemyNormal",
    };

    return normalEnemy;
}

export function getEliteEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);

    const eliteEnemy: IWaveEnemy = {
        health: getRandomInt(40, 90),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -150,
        shootDelay: 600,
        bulletRange: 300,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(5, 15),
        amount: enemyAmount,
        sprite: "enemyElite",
    };

    return eliteEnemy;
}

export function getBossEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = 1;

    const bossEnemy: IWaveEnemy = {
        health: getRandomInt(1500, 3000),
        velocity: 50,
        startX: [width / 2],
        startY: -200,
        shootDelay: 300,
        bulletRange: 300,
        bulletSpeed: 200,
        bulletDamage: getRandomInt(20, 50),
        amount: enemyAmount,
        sprite: "enemyBoss",
    };

    return bossEnemy;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}
