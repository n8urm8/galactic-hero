import type { IWaveEnemy } from "./gameTypes";

function getRandomStartX(width: number) {
    return getRandomInt(width / 2 - 100, width / 2 + 100);
}

// need to include wave number effect
export function getTankEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);
    const waveMod = getWaveMod(wave);

    const tankEnemy: IWaveEnemy = {
        health: getRandomInt(80, 120) * waveMod,
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -50,
        shootDelay: 400 / waveMod,
        bulletRange: 200,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 5) * waveMod,
        amount: enemyAmount,
        sprite: "enemyTank",
    };

    return tankEnemy;
}

export function getNormalEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);
    const waveMod = getWaveMod(wave);

    const normalEnemy: IWaveEnemy = {
        health: getRandomInt(50, 100) * waveMod,
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -100,
        shootDelay: 500 / waveMod,
        bulletRange: 250,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 10) * waveMod,
        amount: enemyAmount,
        sprite: "enemyNormal",
    };

    return normalEnemy;
}

export function getEliteEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = getRandomInt(2, 10);
    const waveMod = getWaveMod(wave);

    const eliteEnemy: IWaveEnemy = {
        health: getRandomInt(40, 90) * waveMod,
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomStartX(width)
        ),
        startY: -150,
        shootDelay: 600 / waveMod,
        bulletRange: 300,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(5, 15) * waveMod,
        amount: enemyAmount,
        sprite: "enemyElite",
    };

    return eliteEnemy;
}

export function getBossEnemy(width: number, wave: number): IWaveEnemy {
    const enemyAmount = 1;
    const waveMod = getWaveMod(wave);

    const bossEnemy: IWaveEnemy = {
        health: getRandomInt(1500, 3000) * waveMod,
        velocity: 50,
        startX: [width / 2],
        startY: -200,
        shootDelay: 300 / waveMod,
        bulletRange: 300,
        bulletSpeed: 200 * waveMod,
        bulletDamage: getRandomInt(20, 50) * waveMod,
        amount: enemyAmount,
        sprite: "enemyBoss",
    };

    return bossEnemy;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getWaveMod(waves: number) {
    return 1 + waves / 1000;
}
