import { Prisma } from "@prisma/client"

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

const playerWithInventory = Prisma.validator<Prisma.PlayerArgs>()({include: {
    ships: true,
    equipment: true
}})
export type PlayerWithInventory = Prisma.PlayerGetPayload<typeof playerWithInventory>