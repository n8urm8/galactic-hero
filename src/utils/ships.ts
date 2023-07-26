export enum PlayerShipSprites {
    base = "ship1",
    normal = "ship2",
    advanced = "ship3",
    expert = "ship4",
}

export type BaseShipStats = {
    health: number;
    shield: number;
    bulletDamage: number;
    bulletSpeed: number;
    bulletRange: number;
};
