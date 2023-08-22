import React, { useState } from "react";
import { Button } from "../button";
import { EventEmitter, GameEvents, SceneEvents } from "~/utils/events";
import { gradientTertiery } from "~/styles/cssVariables";

export const ButtonMenu = () => {
    const emitter = EventEmitter.getInstance();

    const [waving, setWaving] = useState(false);
    const [betweenWaves, setBetweenWaves] = useState(true);
    const [vanguardLevels, setVanguardLevels] = useState([1, 2]);
    const [openVanguardMenu, setOpenVanguardMenu] = useState(false);

    const handleWaveButton = () => {
        if (!waving) {
            emitter.emit(SceneEvents.startWave);
            setWaving(true);
        } else {
            emitter.emit(SceneEvents.endWave);
            setWaving(false);
        }
    };

    const handleVanguardButton = (level: number) => {
        setOpenVanguardMenu(false);
        emitter.emit(SceneEvents.vanguardStarted, { level });
        setBetweenWaves(true);
    };

    emitter.on(
        SceneEvents.waveInitializing,
        (data: { endWave: boolean; gameLoaded: boolean }) => {
            //console.log(data);
            if (data.gameLoaded) {
                setBetweenWaves(false);
            } else {
                setBetweenWaves(!betweenWaves);
            }

            data.endWave && setWaving(false);
        },
        emitter.removeListener(SceneEvents.waveInitializing)
    );

    emitter.on(
        SceneEvents.vanguardEnded,
        () => {
            setBetweenWaves(false);
        },
        emitter.removeListener(SceneEvents.vanguardEnded)
    );

    return (
        <div className="flex gap-1 py-1">
            <Button
                color="yellow"
                disabled={betweenWaves}
                onClick={handleWaveButton}
            >
                {betweenWaves
                    ? "initializing"
                    : !waving
                    ? "Start Wave"
                    : "End Wave"}
            </Button>
            <Button onClick={() => window.alert("coming soon")}>
                Alliance
            </Button>
            <Button onClick={() => window.alert("coming soon")}>Market</Button>
            <div className="relative">
                <Button
                    onClick={() => setOpenVanguardMenu(!openVanguardMenu)}
                    disabled={betweenWaves}
                >
                    Vanguard
                </Button>
                <div
                    className={`${
                        !openVanguardMenu ? "hidden" : "block"
                    } ${gradientTertiery} absolute bottom-10 right-2  flex flex-col-reverse rounded-sm text-right `}
                >
                    {vanguardLevels.map((lvl) => {
                        return (
                            <div
                                key={lvl}
                                className="w-full cursor-pointer whitespace-nowrap bg-black bg-opacity-0 px-4 py-2 text-white hover:bg-opacity-10"
                                onClick={() => handleVanguardButton(lvl)}
                            >
                                Level {lvl}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
