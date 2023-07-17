import Image from "next/image";
import React from "react";
import { PlayerEquipment, PlayerShip } from "~/utils/gameTypes";

export interface IItemImg {
    size: "small" | "large";
    item: PlayerShip | PlayerEquipment;
}

export const ItemImg: React.FC<IItemImg> = ({ size, item }) => {
    const imageStyle = size == "large" ? "w-24 rounded-xl" : "w-8 rounded";

    return (
        <div className={`${imageStyle} relative h-auto border`}>
            <Image src={item.sprite} fill alt={"item"} />
            <p className="absolute right-1 bottom-1">{item.level}</p>
        </div>
    );
};
