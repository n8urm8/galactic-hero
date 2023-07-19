import React, { useEffect, useState } from "react";
import { PlayerEquipment, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { ItemImg } from "./itemImg";
import {
    getEquipmentStats,
    getShipWithEquipmentStats,
} from "~/utils/statFormulas";

export interface IItemOverview {
    item: PlayerShipWithEquipment | PlayerEquipment;
    currentShip: boolean;
}

export const ItemOverview: React.FC<IItemOverview> = ({
    item,
    currentShip,
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
        <>
            <div className="flex gap-2">
                <div>
                    <p>{name}</p>
                    <ItemImg item={item} size="large" />
                </div>
                <div className="flex flex-col">
                    <p>Stats</p>
                    {Object.keys(stats).map((key) => {
                        return (
                            <div className="flex justify-between" key={key}>
                                <p>{key}:</p>
                                <p>{stats[key as keyof typeof stats]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {"equipment" in item && <p className="">Equipped</p>}
            {"equipment" in item && (
                <div className="flex gap-1">
                    {item.equipment.map((item) => (
                        // TODO: add onclick to open item modal
                        <div>
                            <ItemImg item={item} size="small" />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
