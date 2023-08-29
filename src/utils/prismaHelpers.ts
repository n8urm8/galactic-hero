import { prisma } from "~/server/db";

export const getCurrentPlayer = async (userId: string) => {
    const player = await prisma.player.findFirst({
        where: {
            userId: userId,
        },
        include: {
            equipment: true,
            ships: true,
            craftingMaterials: true,
            vanguard: true,
        },
    });
    return player;
};

export const getCurrentShip = async (userId: string) => {
    const currentShip = await prisma.player.findUnique({
        where: {
            userId: userId,
        },
        select: {
            ships: {
                where: {
                    isCurrent: true,
                },
                include: {
                    equipment: true,
                },
            },
        },
    });

    return currentShip ? currentShip.ships[0] : null;
};
