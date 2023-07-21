import { IWaveEnemy } from "./gameTypes";

// need to include wave number effect
export function getTankEnemy(width: number): IWaveEnemy {
    //let enemyAmount = getRandomInt(2,10)
    let enemyAmount = 1;
    let focal = width / 2;
    let range = 100;
    let minRange = Math.max(focal - range, width / 2.5);
    let maxRange = Math.min(focal + range, width / 1.5);

    let tankEnemy: IWaveEnemy = {
        health: getRandomInt(80, 120),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomInt(minRange, maxRange)
        ),
        startY: -50,
        shootDelay: 400,
        bulletRange: 100,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 5),
        amount: enemyAmount,
        sprite: "enemyTank",
    };

    return tankEnemy;
}

export function getNormalEnemy(width: number): IWaveEnemy {
    //let enemyAmount = getRandomInt(2,10)
    let enemyAmount = 1;
    let focal = width / 2;
    let range = 200;
    let minRange = Math.max(focal - range, width / 2);
    let maxRange = Math.min(focal + range, width);

    let normalEnemy: IWaveEnemy = {
        health: getRandomInt(50, 100),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomInt(minRange, maxRange)
        ),
        startY: -100,
        shootDelay: 500,
        bulletRange: 200,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(1, 10),
        amount: enemyAmount,
        sprite: "enemyNormal",
    };

    return normalEnemy;
}

export function getEliteEnemy(width: number): IWaveEnemy {
    //let enemyAmount = getRandomInt(2,10)
    let enemyAmount = 1;
    let focal = width / 2;
    let range = 300;
    let minRange = Math.max(focal - range, width / 2);
    let maxRange = Math.min(focal + range, width);

    let eliteEnemy: IWaveEnemy = {
        health: getRandomInt(40, 90),
        velocity: getRandomInt(50, 150),
        startX: Array.from({ length: enemyAmount }, () =>
            getRandomInt(minRange, maxRange)
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

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}
