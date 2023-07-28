import { Game as GameType } from "phaser";
import { useState, useEffect } from "react";

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

            const phaserGame = new Phaser.Game({
                title: "Galatic Hero",
                type: Phaser.AUTO,
                parent: "game-content",
                scene: [BootScene, GameScene, WaveScene, EndWaveScene],
                backgroundColor: "#000",
                pixelArt: true,
                physics: {
                    default: "arcade",
                    arcade: {
                        //debug: true,
                        gravity: { y: 0 },
                        //debugShowVelocity: true,
                    },
                },
                scale: {
                    mode: Phaser.Scale.FIT,
                    //width: "100%",
                    //height: "95%",
                    zoom: 1.25,
                },
            });
            setGame(phaserGame);
        }
        game == undefined && initPhaser().catch((e) => console.error(e));
        //return () => {};
    }, [game]);

    return (
        <div
            id="game-content"
            key="game-content"
            className="mt-8 block h-full max-h-[600px] w-full rounded-md"
        ></div>
    );
};
