import { EventEmitter, GameEvents } from "~/utils/events";
import { useSession } from "next-auth/react";
import { Game as GameType } from "phaser";
import { Head } from "next/document";
import { useState, useEffect } from "react";
import { AuthShowcase } from "~/pages";
import { api } from "~/utils/api";

export const [gameWidth, gameHeight] = [900, 400];
export const GameCanvas = () => {
    const [game, setGame] = useState<GameType>();

    useEffect(() => {
        async function initPhaser() {
            const Phaser = await import("phaser");
            const { default: BootScene } = await import(
                "../game/scenes/BootScene"
            );
            const { default: GameScene } = await import(
                "../game/scenes/GameScene"
            );
            const { default: WaveScene } = await import(
                "../game/scenes/WaveScene"
            );
            const { default: EndWaveScene } = await import(
                "../game/scenes/EndWaveScene"
            );
            const { default: UpgradeMenuScene } = await import(
                "../game/scenes/upgradeMenu"
            );
            const { default: InventoryScene } = await import(
                "../game/scenes/InventoryScene"
            );

            const phaserGame = new Phaser.Game({
                title: "Galatic Hero",
                // width: Math.min(window.innerHeight*2.25, gameWidth),
                // height: Math.min(window.innerWidth/2.25, gameHeight),
                type: Phaser.AUTO,
                parent: "game-content",
                scene: [
                    BootScene,
                    GameScene,
                    WaveScene,
                    EndWaveScene,
                    UpgradeMenuScene,
                    InventoryScene,
                ],
                backgroundColor: "#000",
                pixelArt: true,
                physics: {
                    default: "arcade",
                    arcade: {
                        debug: true,
                        gravity: { y: 0 },
                        debugShowVelocity: true,
                    },
                },
                scale: {
                    mode: Phaser.Scale.FIT,
                    width: "100%",
                    height: "95%",
                    zoom: 1,
                },
            });
            setGame(phaserGame);
        }
        game == undefined && initPhaser();
        return () => {};
    }, [game]);

    return (
        <div
            id="game-content"
            key="game-content"
            className="block h-full w-full rounded-md"
        ></div>
    );
};
