import React from "react";
import { Modal } from "../modal";

export interface IPlayerStats {
    name: string;
    rankings: { name: string; waves: number }[];
    waves: number;
    credits: number;
}

export const PlayerStats: React.FC<IPlayerStats> = ({
    name,
    rankings,
    waves,
    credits,
}) => {
    const rank = rankings.findIndex((player) => player.name === name) + 1;

    return (
        <div className="flex w-full justify-between rounded-md border p-2">
            <div className="flex flex-col font-semibold">
                <p>{name}</p>
                <p>Waves</p>
                <p>Credits</p>
            </div>
            <div className="flex flex-col text-right">
                <Modal
                    buttonElement={<p>Rank {rank}</p>}
                    header={"Player Rankings"}
                    body={
                        <div className="flex max-h-96 flex-col overflow-y-auto">
                            {rankings.map((player, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between p-1"
                                    >
                                        <p>
                                            {i + 1} - {player.name}
                                        </p>
                                        <p>{player.waves}</p>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    footer={""}
                />

                <p>{waves}</p>
                <p>{credits}</p>
            </div>
        </div>
    );
};
