import React from "react";

export interface ICrafting {
    metal: number;
    energy: number;
    gilding: number;
}

export const Crafting: React.FC<ICrafting> = ({
    metal = 0,
    energy = 0,
    gilding = 0,
}) => {
    return (
        <div className="flex min-h-[150px] w-full flex-col rounded-md border p-1">
            <div className="flex flex-row gap-2">
                <p>{metal} Kamacite |</p>
                <p>{energy} Deuterium |</p>
                <p>{gilding} Platinum</p>
            </div>
        </div>
    );
};
