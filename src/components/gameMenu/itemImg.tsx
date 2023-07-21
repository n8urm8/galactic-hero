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
    console.log("img url:", imgURL);
    return (
        <div className={`${imageStyle} relative h-auto border`}>
            <img src={imgURL} alt={"item"} />
            <p className="absolute right-2 bottom-1">{item.level}</p>
        </div>
    );
};
