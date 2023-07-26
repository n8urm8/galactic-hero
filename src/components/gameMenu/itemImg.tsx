import Image from "next/image";
import React from "react";
import { PlayerEquipment, PlayerShip } from "~/utils/gameTypes";
import { spriteSelector } from "~/utils/spritePaths";

export interface IItemImg {
    size: "small" | "large";
    item: PlayerShip | PlayerEquipment;
}

export const ItemImg: React.FC<IItemImg> = ({ size, item }) => {
    const imageStyle = size == "large" ? "w-24 rounded-xl" : "w-8 rounded";
    const imgURL = spriteSelector[item.sprite as keyof typeof spriteSelector];
    const pStyle =
        size == "large"
            ? "absolute right-2 bottom-1"
            : "absolute text-xs right-[2px] bottom-[1px]";
    return (
        <div className={`${imageStyle} relative h-auto border`}>
            <img className="w-24" src={imgURL} alt={"item"} />
            <p className={pStyle}>{item.level}</p>
        </div>
    );
};
