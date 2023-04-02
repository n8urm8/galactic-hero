export interface IWaveEnemy {
    health: number
    velocity: number 
    startX: number[]
    startY: number
    shootDelay: number
    bulletRange: number
    bulletSpeed: number
    bulletDamage: number
    amount: number
    sprite: string
}

// need to include wave number effect
export function getTankEnemy(width: number): IWaveEnemy {
    let enemyAmount = getRandomInt(10)+2

    let tankEnemy: IWaveEnemy = {
        health: getRandomInt(100),
        velocity: getRandomInt(100) + 50,
        startX: Array.from({length: enemyAmount}, () => width / (Math.random() + 1)),
        startY: -50,
        shootDelay: 500,
        bulletRange: 100,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(10),
        amount: enemyAmount,
        sprite: 'enemyTank',
    }
    
    return tankEnemy
}

export function getNormalEnemy(width: number): IWaveEnemy {
    let enemyAmount = getRandomInt(10)+2
    let normalEnemy: IWaveEnemy = {
        health: getRandomInt(100),
        velocity: getRandomInt(100) + 50,
        startX: Array.from({length: enemyAmount}, () => width / (Math.random() + 1)),
        startY: -100,
        shootDelay: 500,
        bulletRange: 200,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(10),
        amount: enemyAmount,
        sprite: 'enemyNormal',
    }
    
    return normalEnemy
}

export function getEliteEnemy(width: number): IWaveEnemy {
    let enemyAmount = getRandomInt(10)+2
    let eliteEnemy: IWaveEnemy = {
        health: getRandomInt(100),
        velocity: getRandomInt(100) + 50,
        startX: Array.from({length: enemyAmount}, () => width / (Math.random() + 1)),
        startY: -150,
        shootDelay: 500,
        bulletRange: 300,
        bulletSpeed: 100,
        bulletDamage: getRandomInt(10),
        amount: enemyAmount,
        sprite: 'enemyElite',
    }
    
    return eliteEnemy
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }