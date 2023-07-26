import React from "react";
import {
    PlayerEquipment,
    PlayerShip,
    PlayerShipWithEquipment,
} from "~/utils/gameTypes";
import { Modal } from "../modal";
import { ItemImg } from "./itemImg";
import { ItemOverview } from "./itemOverview";

export interface IInventory {
    ships: PlayerShipWithEquipment[];
    equipment: PlayerEquipment[];
}

export const Inventory: React.FC<IInventory> = ({ ships, equipment }) => {
    return (
        <div>
            <p>Inventory</p>
            <div className="flex flex-col rounded-md border p-2">
                <p className="text-xs">SHIPS</p>
                <div className="max-h-18 mb-1 flex flex-row gap-1 overflow-y-auto">
                    {ships.map((ship) => {
                        return (
                            <Modal
                                key={ship.id}
                                buttonElement={
                                    <ItemImg size={"small"} item={ship} />
                                }
                                header={"Ship Details"}
                                body={
                                    <ItemOverview
                                        item={ship}
                                        currentShip={false}
                                    />
                                }
                                footer={undefined}
                            />
                        );
                    })}
                </div>
                <p className="text-xs">EQUIPMENT</p>
                <div className="max-h-18 mb-1 flex flex-row gap-1 overflow-y-auto">
                    {equipment.map((item) => {
                        return (
                            <Modal
                                key={item.id}
                                buttonElement={
                                    <ItemImg size={"small"} item={item} />
                                }
                                header={"Item Details"}
                                body={
                                    <ItemOverview
                                        item={item}
                                        currentShip={false}
                                    />
                                }
                                footer={undefined}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
