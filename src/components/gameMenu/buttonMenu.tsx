import React, { useState } from "react";
import { Button } from "../button";
import { EventEmitter, GameEvents } from "~/utils/events";

export const ButtonMenu = () => {
    const emitter = EventEmitter.getInstance();

    const [waving, setWaving] = useState(false);
    const [betweenWaves, setBetweenWaves] = useState(true);

    const handleWaveButton = () => {
        if (!waving) {
            emitter.emit(GameEvents.startWave);
            setWaving(true);
        } else {
            emitter.emit(GameEvents.endWave);
            setWaving(false);
        }
    };

    emitter.on(
        GameEvents.waveInitializing,
        (data: { endWave: boolean; gameLoaded: boolean }) => {
            //console.log(data);
            if (data.gameLoaded) {
                setBetweenWaves(false);
            } else {
                setBetweenWaves(!betweenWaves);
            }

            data.endWave && setWaving(false);
        },
        emitter.removeListener(GameEvents.waveInitializing)
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
            <Button onClick={() => window.alert("coming soon")}>
                Vanguard
            </Button>
        </div>
    );
};
