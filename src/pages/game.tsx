import { useEffect, useState } from "react"
import { Game as GameType } from 'phaser'
import { EventEmitter } from "~/utils/events"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export const [gameWidth, gameHeight] = [900, 400]

const Game = () => {
    const router = useRouter()
    const { data: sessionData } = useSession();
    sessionData?.user == undefined && router.push('/')
    const [game, setGame] = useState<GameType>()
    const emitter = EventEmitter.getInstance()
    const [width, setWidth] = useState<number>(1000)
    const enemyLoad = api.waveInfo.getWaveEnemies.useQuery({ width: width })
    
    // Work out a router function to handle all events and responses
    const loadEnemy = (data:any) =>{
        setWidth(data.width)
        // verify refetch not needed
        // enemyLoad.refetch()
        emitter.emit('enemyLoaded', enemyLoad.data)
    }
    emitter.on('startWave', loadEnemy)
    
    useEffect(() => {
        async function initPhaser(){
            const Phaser = await import('phaser')
            const {default: BootScene} = await import('../game/scenes/BootScene')
            const {default: GameScene} = await import('../game/scenes/GameScene')
            const {default: WaveScene} = await import('../game/scenes/WaveScene')
            setWidth(window.innerWidth)
            const phaserGame = new Phaser.Game({
                title: 'Galatic Hero',
                width: gameWidth,
                height: gameHeight,
                type: Phaser.AUTO,
                parent: 'game-content',
                scene: [BootScene, GameScene, WaveScene],
                backgroundColor: '#000',
                pixelArt: true,
                physics: {
                    default: "arcade",
                    arcade:{
                        debug: false,
                        gravity: {y: 0},
                        //debugShowVelocity: false
                    }
                },
                scale: {
                    mode: Phaser.Scale.NONE,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                }
            })
            setGame(phaserGame)
        }
        game == undefined && initPhaser()
        return () => {}
    }, [game])

    useEffect(() => {
        function handleWindowResize() {
            game?.scale.resize(window.innerWidth, window.innerHeight)
            setWidth(window.innerWidth)
            //console.log('resizing window...')
        }
        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            //console.log('cleanup window resize event')
        }
    })

    return (
        <div className="w-full h-full">
            <div id='game-content' key='game-content' className="">

            </div>
        </div>
    )
}

export default Game