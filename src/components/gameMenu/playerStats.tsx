import React from "react";

export interface IPlayerStats {
    name: string;
    rank?: string;
    waves: number;
    credits: number;
}

export const PlayerStats: React.FC<IPlayerStats> = ({
    name,
    rank = 2,
    waves,
    credits,
}) => {
    return (
        <div className="flex justify-between">
            <div className="flex flex-col">
                <p>{name}</p>
                <p>Waves</p>
                <p>Credits</p>
            </div>
            <div className="flex flex-col text-right">
                <p>Rank {rank}</p>
                <p>{waves}</p>
                <p>{credits}</p>
            </div>
        </div>
    );
};
