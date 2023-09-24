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
import { Chip } from "../chip";
import { gradientPrimary } from "~/styles/cssVariables";

export interface ICrafting {
    resources: {
        credits: BigInt;
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
        <div className="flex min-h-[150px] w-full flex-col  rounded-md  bg-slate-600 bg-opacity-50">
            {!showItem ? (
                <>
                    <div className="flex flex-col border-b border-slate-700 text-center text-sm">
                        <div
                            className={`grid grid-cols-3 rounded-t-md ${gradientPrimary}`}
                        >
                            <p className=" text-white">{resourceKeys.metal}</p>
                            <p className=" text-white">{resourceKeys.energy}</p>
                            <p className=" text-white">
                                {resourceKeys.gilding}
                            </p>
                        </div>
                        <div className="grid grid-cols-3">
                            <p className="">{resources.metal}</p>
                            <p>{resources.energy}</p>
                            <p>{resources.gilding}</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-evenly p-1 ">
                        <Chip
                            size="lg"
                            action={() => setCraftingType("ship")}
                            active={craftingType == "ship"}
                        >
                            Ship
                        </Chip>
                        <Chip
                            size="lg"
                            action={() => setCraftingType("equipment")}
                            active={craftingType == "equipment"}
                        >
                            Equipment
                        </Chip>
                    </div>
                    <div className="flex flex-row justify-evenly p-1 ">
                        {Object.keys(tierKeys).map((key) => {
                            return (
                                <Chip
                                    size="sm"
                                    active={tier == key}
                                    action={() => setTier(key as Tier)}
                                    key={key}
                                >
                                    {tierKeys[key]}
                                </Chip>
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
