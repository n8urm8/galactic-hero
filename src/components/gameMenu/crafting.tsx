import React, { useState } from "react";
import { equipmentCraftingCosts } from "~/utils/equipment";
import { EventEmitter, GameEvents } from "~/utils/events";
import {
    CraftingType,
    PlayerEquipment,
    PlayerShip,
    PlayerShipWithEquipment,
    Tier,
    resourceKeys,
} from "~/utils/gameTypes";
import { shipCraftingCosts } from "~/utils/ships";
import { Button } from "../button";
import { api } from "~/utils/api";
import { ItemOverview } from "./itemOverview";

export interface ICrafting {
    resources: {
        credits: number;
        metal: number;
        energy: number;
        gilding: number;
    };
}

export const Crafting: React.FC<ICrafting> = ({ resources }) => {
    const craftAPI = api.crafting.craftShipOrEquipment.useMutation();
    const emitter = EventEmitter.getInstance();
    const [craftingType, setCraftingType] = useState<CraftingType>("ship");
    const [tier, setTier] = useState<Tier>("T1");
    const [newItem, setNewItem] = useState({});
    const [showItem, setShowItem] = useState(false);

    const tierKeys = {
        T1: "I",
        T2: "II",
        T3: "III",
        T4: "IV",
    };

    const craftingCost =
        craftingType == "equipment"
            ? equipmentCraftingCosts[tier]
            : shipCraftingCosts[tier];

    const handleCraft = async () => {
        const newCraft = await craftAPI.mutateAsync({
            type: craftingType,
            tier: tier,
        });
        emitter.emit(GameEvents.refreshProfile);
        setNewItem(newCraft);
        setShowItem(true);
    };

    return (
        <div className="flex min-h-[150px] w-full flex-col  rounded-md border">
            {!showItem ? (
                <>
                    <div className="flex flex-row justify-between border-b px-1 text-right text-sm">
                        <p className="">
                            {resources.metal} {resourceKeys.metal}
                        </p>
                        <p>
                            {resources.energy} {resourceKeys.energy}
                        </p>
                        <p>
                            {resources.gilding} {resourceKeys.gilding}
                        </p>
                    </div>
                    <div className="flex flex-row justify-evenly p-1 ">
                        <p
                            onClick={() => setCraftingType("ship")}
                            className={
                                craftingType == "ship"
                                    ? "w-24 cursor-pointer border bg-slate-50 text-center text-black hover:bg-slate-50 hover:text-black"
                                    : "w-24 cursor-pointer border text-center hover:bg-slate-50 hover:text-black"
                            }
                        >
                            Ship
                        </p>
                        <p
                            onClick={() => setCraftingType("equipment")}
                            className={
                                craftingType == "equipment"
                                    ? "w-24 cursor-pointer border bg-slate-50 text-center text-black hover:bg-slate-50 hover:text-black"
                                    : "w-24 cursor-pointer border text-center hover:bg-slate-50 hover:text-black"
                            }
                        >
                            Equipment
                        </p>
                    </div>
                    <div className="flex flex-row justify-evenly p-1 ">
                        {Object.keys(tierKeys).map((key) => {
                            return (
                                <p
                                    onClick={() => setTier(key as Tier)}
                                    key={key}
                                    className={
                                        tier == key
                                            ? "w-12 cursor-pointer border bg-slate-50 text-center text-black hover:bg-slate-50 hover:text-black"
                                            : "w-12 cursor-pointer border text-center hover:bg-slate-50 hover:text-black"
                                    }
                                >
                                    {tierKeys[key]}
                                </p>
                            );
                        })}
                    </div>
                    <div className="flex flex-row justify-evenly p-1 ">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.keys(craftingCost).map((key) => {
                                return (
                                    <p
                                        key={key}
                                        className={
                                            resources[key] < craftingCost[key]
                                                ? "text-red-700"
                                                : ""
                                        }
                                    >
                                        {craftingCost[key]} {resourceKeys[key]}
                                    </p>
                                );
                            })}
                        </div>
                        <Button
                            onClick={handleCraft}
                            disabled={craftAPI.isLoading}
                        >
                            Craft
                        </Button>
                    </div>
                </>
            ) : (
                <div
                    onClick={() => setShowItem(false)}
                    className="cursor-pointer p-2"
                >
                    <div className="w-full text-center">
                        <p>New {craftingType}!</p>
                    </div>
                    <ItemOverview
                        item={
                            newItem as PlayerEquipment | PlayerShipWithEquipment
                        }
                        currentShip={false}
                        currentCredits={resources.credits}
                    />
                </div>
            )}
        </div>
    );
};
