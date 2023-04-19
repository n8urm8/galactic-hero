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
    ships: {
        include: {
          equipment: true
        },
      },
    equipment: true
}})
export type PlayerWithInventory = Prisma.PlayerGetPayload<typeof playerWithInventory>

const equipment = Prisma.validator<Prisma.EquipmentArgs>()({})
export type PlayerEquipment = Prisma.EquipmentGetPayload<typeof equipment>

const ship = Prisma.validator<Prisma.ShipArgs>()({})
export type PlayerShip = Prisma.ShipGetPayload<typeof ship>

const shipWithEquipment = Prisma.validator<Prisma.ShipArgs>()({include: {
    equipment: true
}})
export type PlayerShipWithEquipment = Prisma.ShipGetPayload<typeof shipWithEquipment>


export type Tier = 'T1' | 'T2' | 'T3' | 'T4'
export type EquipmentType = 'Offensive' | 'Defensive' | 'Utility'