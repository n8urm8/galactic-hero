import { useEffect, useState } from "react"
import { Game as GameType } from 'phaser'


const Game = () => {
    const [game, setGame] = useState<GameType>()
    
    useEffect(() => {
        async function initPhaser(){
            const Phaser = await import('phaser')
            const {default: BootScene} = await import('../game/scenes/BootScene')
            const {default: GameScene} = await import('../game/scenes/GameScene')
            const phaserGame = new Phaser.Game({
                title: 'Galatic Hero',
                width: 800,
                height: 640,
                type: Phaser.AUTO,
                parent: 'game-content',
                scene: [BootScene, GameScene],
                backgroundColor: '#000',
                pixelArt: true,
                physics: {
                default: "arcade",
                arcade:{
                    debug: true,
                    gravity: {y: 0},
                    //debugShowVelocity: false
                }
                }
            })
            setGame(phaserGame)
        }
        game == undefined && initPhaser()
        return () => {}
    }, [game])

    return (
        <div className="w-full">
            <div id='game-content' key='game-content' className="ml-20 mt-10">

            </div>
        </div>
    )
}

export default Game