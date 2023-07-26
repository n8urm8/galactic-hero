import React, { useEffect, useState } from "react";
import { PlayerEquipment, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { ItemImg } from "./itemImg";
import {
    getEquipmentStats,
    getShipWithEquipmentStats,
} from "~/utils/statFormulas";
import { Modal } from "../modal";
import { Button, ConfirmButton } from "../button";
import { EventEmitter, GameEvents } from "~/utils/events";
import { ItemButtons } from "./itemButtons";

export interface IItemOverview {
    item: PlayerShipWithEquipment | PlayerEquipment;
    currentShip: boolean;
    currentCredits: number;
    clickable?: boolean;
}

export const ItemOverview: React.FC<IItemOverview> = ({
    item,
    currentShip,
    clickable = false,
    currentCredits,
}) => {
    const [stats, setStats] = useState({
        Level: "0",
        Health: "0",
        Shield: "0",
        Damage: "0",
        Speed: "0",
        Range: "0",
        Interval: "0",
        Battery: "0",
    });

    const name = currentShip
        ? "Current Ship"
        : "type" in item
        ? item.type.toUpperCase()
        : "Ship";

    useEffect(() => {
        if ("equipment" in item) {
            const newStats = getShipWithEquipmentStats(
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
                Level: item.level.toFixed(0),
                Health: newStats.health.toFixed(0),
                Shield: newStats.shield.toFixed(1),
                Damage: newStats.damage.toFixed(1),
                Speed: newStats.speed.toFixed(0),
                Range: newStats.range.toFixed(0),
                Interval: newStats.interval.toFixed(0),
                Battery: `${newStats.batteryUsage}/${newStats.maxBattery}`,
            });
        } else {
            const newStats = getEquipmentStats(
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
                Level: item.level.toFixed(0),
                Health: newStats.health.toFixed(0),
                Shield: newStats.shield.toFixed(1),
                Damage: newStats.damage.toFixed(1),
                Speed: newStats.speed.toFixed(0),
                Range: newStats.range.toFixed(0),
                Interval: newStats.interval.toFixed(0),
                Battery: `${newStats.batteryUsage}`,
            });
        }
    }, [item]);

    return (
        <div className="flex flex-col">
            <div className="flex min-w-[280px] justify-between gap-2">
                <div>
                    <p>{name}</p>
                    {clickable ? (
                        <Modal
                            buttonElement={<ItemImg item={item} size="large" />}
                            header={name}
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
                    ) : (
                        <ItemImg item={item} size="large" />
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
                            key={item.id}
                            buttonElement={<ItemImg item={item} size="small" />}
                            header={name}
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
                    ))}
                </div>
            )}
        </div>
    );
};
