import React, { useEffect, useState } from "react";
import { PlayerEquipment, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { ItemImg } from "./itemImg";
import {
    getEquipmentStats,
    getShipWithEquipmentStats,
} from "~/utils/statFormulas";
import { Modal } from "../modal";
import { Button } from "../button";

export interface IItemOverview {
    item: PlayerShipWithEquipment | PlayerEquipment;
    currentShip: boolean;
    clickable?: boolean;
}

export const ItemOverview: React.FC<IItemOverview> = ({
    item,
    currentShip,
    clickable = false,
}) => {
    const [stats, setStats] = useState({
        Level: 0,
        Health: 0,
        Shield: 0,
        Damage: 0,
        Speed: 0,
        Range: 0,
        Interval: 0,
        Battery: "0",
    });

    const name = currentShip
        ? "Current Ship"
        : "type" in item
        ? item.type.toUpperCase()
        : "Ship";

    const equipBtnTxt =
        currentShip || ("shipId" in item && item.shipId) ? "unequip" : "equip";

    useEffect(() => {
        if ("equipment" in item) {
            let newStats = getShipWithEquipmentStats(
                item.level,
                item.health,
                item.shield,
                item.bulletDamage,
                item.bulletSpeed,
                item.shootDelay,
                item.bulletRange,
                item.battery,
                item.equipment
            );
            setStats({
                Level: item.level,
                Health: newStats.health,
                Shield: newStats.shield,
                Damage: newStats.damage,
                Speed: newStats.speed,
                Range: newStats.range,
                Interval: newStats.interval,
                Battery: `${newStats.batteryUsage}/${newStats.maxBattery}`,
            });
        } else {
            let newStats = getEquipmentStats(
                item.level,
                item.health,
                item.shield,
                item.bulletDamage,
                item.bulletSpeed,
                item.shootDelay,
                item.bulletRange,
                item.battery
            );
            setStats({
                Level: item.level,
                Health: newStats.health,
                Shield: newStats.shield,
                Damage: newStats.damage,
                Speed: newStats.speed,
                Range: newStats.range,
                Interval: newStats.interval,
                Battery: `${newStats.batteryUsage}`,
            });
        }
    }, [item]);

    return (
        <div className="flex flex-col">
            <div className="flex  justify-between gap-2">
                <div>
                    <p>{name}</p>
                    {clickable ? (
                        <Modal
                            buttonElement={<ItemImg item={item} size="large" />}
                            header={""}
                            body={
                                <ItemOverview item={item} currentShip={false} />
                            }
                            footer={
                                <div className="flex gap-1">
                                    <Button color="yellow">Level Up</Button>
                                    <Button>{equipBtnTxt}</Button>
                                </div>
                            }
                        />
                    ) : (
                        <ItemOverview item={item} currentShip={false} />
                    )}
                </div>
                <div className="flex w-full flex-col">
                    {Object.keys(stats).map((key) => {
                        return (
                            <div
                                className="-my-1 flex w-full justify-between"
                                key={key}
                            >
                                <p>{key}:</p>
                                <p>{stats[key as keyof typeof stats]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {"shipId" in item && item.shipId && (
                <p>Equipped to Ship {item.shipId}</p>
            )}
            {"equipment" in item && <p className="">Equipment</p>}
            {"equipment" in item && (
                <div className="flex min-h-[15px] gap-1 rounded-md border">
                    {item.equipment.map((item) => (
                        <Modal
                            buttonElement={<ItemImg item={item} size="small" />}
                            header={""}
                            body={
                                <ItemOverview item={item} currentShip={false} />
                            }
                            footer={
                                <>
                                    <Button>Level Up</Button>
                                    <Button>Equip</Button>
                                </>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
