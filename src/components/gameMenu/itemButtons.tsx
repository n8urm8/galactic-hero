import { EventEmitter, GameEvents } from "~/utils/events";
import { ConfirmButton } from "../button";
import { PlayerEquipment, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
    getEquipmentLevelUpCost,
    getShipLevelUpCost,
} from "~/utils/costFormulas";
import { Equipment, Ship } from "@prisma/client";

interface IItemButtons {
    item: PlayerEquipment | PlayerShipWithEquipment;
    currentCredits: number;
}

export const ItemButtons: React.FC<IItemButtons> = ({
    item,
    currentCredits,
}) => {
    const levelUpShipAPI = api.profile.shipLevelUp.useMutation();
    const equipShipAPI = api.profile.updateCurrentShip.useMutation();
    const equipItemAPI = api.profile.updateShipEquipment.useMutation();
    const equipmentLevelUpAPI = api.profile.equipmentLevelUp.useMutation();

    const emitter = EventEmitter.getInstance();
    const equipBtnTxt =
        ("isCurrent" in item && item.isCurrent) ||
        ("shipId" in item && item.shipId)
            ? "unequip"
            : "equip";
    const isShip = "isCurrent" in item;

    const levelUpEquipment = async () => {
        //console.log("leveling up equipment");
        await equipmentLevelUpAPI.mutateAsync({ equipmentId: item.id });
        emitter.emit(GameEvents.refreshProfile);
    };

    const levelUpShip = async () => {
        //console.log("leveling up ship");
        await levelUpShipAPI.mutateAsync({
            playerId: item.playerId,
            shipId: item.id,
        });
        emitter.emit(GameEvents.refreshProfile);
    };

    const equipNewShip = async () => {
        await equipShipAPI.mutateAsync({ newShipId: item.id });
        emitter.emit(GameEvents.refreshProfile);
    };

    const equipItem = async () => {
        const data =
            "shipId" in item && item.shipId
                ? { equipmentIdRemove: item.id }
                : { equipmentIdAdd: item.id };
        await equipItemAPI.mutateAsync(data);
        emitter.emit(GameEvents.refreshProfile);
    };

    const levelUp = () => {
        isShip ? levelUpShip() : levelUpEquipment();
    };

    const handleEquip = () => {
        if (isShip) {
            equipNewShip();
        } else {
            equipItem();
        }
    };

    const lvlCost = isShip
        ? getShipLevelUpCost(item as Ship)
        : getEquipmentLevelUpCost(item as Equipment);
    const haveFunds = currentCredits >= lvlCost;
    const disabled =
        levelUpShipAPI.isLoading ||
        equipShipAPI.isLoading ||
        equipItemAPI.isLoading ||
        equipmentLevelUpAPI.isLoading;

    return (
        <div className="flex gap-1">
            <ConfirmButton
                baseText={"Level Up"}
                confirmText={lvlCost.toFixed(0) + " credits"}
                onClick={() => levelUp()}
                color={"yellow"}
                disabled={!haveFunds || disabled}
            />
            {!("isCurrent" in item && item.isCurrent) && (
                <ConfirmButton
                    baseText={equipBtnTxt}
                    confirmText={"Confirm"}
                    onClick={() => handleEquip()}
                    color="violet"
                    disabled={disabled}
                />
            )}
        </div>
    );
};
