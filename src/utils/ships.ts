export enum PlayerShipSprites {
    base = 'ship1',
    normal = 'ship2',
    advanced = 'ship3',
    expert = 'ship4'
}

export const getLevelUpCost = (currentLevel: number, increase: number) => {
    const costPerLevel = 100
    let totalCost = 0
    for (let i = 0; i < increase; i++) {
        totalCost += (currentLevel + i) * costPerLevel
    }

    return totalCost
}