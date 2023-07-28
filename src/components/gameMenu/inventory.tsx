import React from "react";
import {
    PlayerEquipment,
    PlayerShip,
    PlayerShipWithEquipment,
} from "~/utils/gameTypes";
import { Modal } from "../modal";
import { ItemImg } from "./itemImg";
import { ItemOverview } from "./itemOverview";
import { ItemButtons } from "./itemButtons";

export interface IInventory {
    ships: PlayerShipWithEquipment[];
    equipment: PlayerEquipment[];
    currentCredits: number;
}

export const Inventory: React.FC<IInventory> = ({
    ships,
    equipment,
    currentCredits,
}) => {
    return (
        <div>
            <p>Inventory</p>
            <div className="flex flex-col rounded-md border p-2">
                <p className="text-xs">SHIPS</p>
                <div className="mb-1 flex h-[72px] max-w-sm flex-row flex-wrap gap-1 overflow-y-auto">
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
                                        clickable={false}
                                        currentCredits={currentCredits}
                                    />
                                }
                                footer={
                                    <ItemButtons
                                        item={ship}
                                        currentCredits={currentCredits}
                                    />
                                }
                            />
                        );
                    })}
                </div>
                <p className="text-xs">EQUIPMENT</p>
                <div className="mb-1 flex h-[72px] max-w-sm flex-row flex-wrap gap-1 overflow-y-auto">
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
                                        clickable={false}
                                        currentCredits={currentCredits}
                                    />
                                }
                                footer={
                                    <ItemButtons
                                        item={item}
                                        currentCredits={currentCredits}
                                    />
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
