import Image from "next/image";
import React from "react";
import {
    gradientPrimary,
    gradientSecondary,
    gradientTertiery,
} from "~/styles/cssVariables";
import { PlayerEquipment, PlayerShip } from "~/utils/gameTypes";
import { spriteSelector } from "~/utils/spritePaths";

export interface IItemImg {
    size: "small" | "large";
    item: PlayerShip | PlayerEquipment;
}

export const ItemImg: React.FC<IItemImg> = ({ size, item }) => {
    const imageStyle =
        size == "large" ? "w-24 h-24  rounded-xl" : "w-8 h-8 rounded";
    const imgURL =
        spriteSelector[item.sprite as keyof typeof spriteSelector][item.rarity];
    const pStyle =
        size == "large"
            ? "absolute right-2 bottom-1"
            : "absolute text-xs right-[2px] bottom-[1px]";
    const borderStyle =
        ("shipId" in item && item.shipId) ||
        ("isCurrent" in item && item.isCurrent && size == "small")
            ? gradientSecondary
            : "";
    return (
        <div
            className={`${imageStyle} ${borderStyle} relative ${gradientTertiery} `}
        >
            <Image
                className="object-contain p-[2px]"
                fill
                src={imgURL}
                alt={"item"}
            />
            <p className={pStyle}>{item.level}</p>
        </div>
    );
};
