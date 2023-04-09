import { useEffect, useState } from "react"
import { Game as GameType } from 'phaser'
import { EventEmitter, GameEvents } from "~/utils/events"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { AuthShowcase } from "."
import Head from "next/head"

export const [gameWidth, gameHeight] = [900, 400]

const Game = () => {
    const { data: sessionData } = useSession();
    const [game, setGame] = useState<GameType>()
    const emitter = EventEmitter.getInstance()
    
    const profile = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user != undefined
    })
    const waves = api.profile.updateWaveCount.useMutation()
    const loadProfile = () =>{
        //console.log('game.tsx getProfile')
        emitter.emit(GameEvents.profileLoaded, profile.data)
    }
    emitter.on(GameEvents.getProfile, 
        loadProfile, 
        emitter.removeListener(GameEvents.getProfile)
    )

    emitter.on(GameEvents.waveCompleted, async () => {
        //console.log('game.tsx waveCompletedDB')
        let result = await waves.mutateAsync({amount: 1})
        
        emitter.emit(GameEvents.waveCountUpdated, {waves: result.waves})
        }, 
        emitter.removeListener(GameEvents.waveCompleted)
    )
    
    useEffect(() => {
        async function initPhaser(){
            const Phaser = await import('phaser')
            const {default: BootScene} = await import('../game/scenes/BootScene')
            const {default: GameScene} = await import('../game/scenes/GameScene')
            const {default: WaveScene} = await import('../game/scenes/WaveScene')
            const {default: EndWaveScene} = await import('../game/scenes/EndWaveScene')

            const phaserGame = new Phaser.Game({
                title: 'Galatic Hero',
                width: gameWidth,
                height: gameHeight,
                type: Phaser.AUTO,
                parent: 'game-content',
                scene: [BootScene, GameScene, WaveScene, EndWaveScene],
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
                },
                
            })
            setGame(phaserGame)
        }
        game == undefined && initPhaser()
        return () => {}
    }, [game])

    useEffect(() => {
        function handleWindowResize() {
            game?.scale.resize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            //console.log('cleanup window resize event')
        }
    })

    return (
        <div className="w-full h-full relative bg-black">
            <Head>
            <title>Galactic Hero</title>
                <meta name="description" content="Idle, space defender game" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            {profile?.data == undefined && 
                <div className="w-full h-full p-6 items-center text-center bg-slate-500 bg-opacity-5 fixed top-0 z-10">
                    <div className="w-full h-fit p-6 items-center text-center bg-slate-900 bg-opacity-75">
                        <p className="text-2xl text-white font-semibold">You must login and create a profile before playing</p>
                        <AuthShowcase />
                    </div>
                </div>    
            }

            <div id='game-content' key='game-content' className="">

            </div>
            
        </div>
    )
}

export default Game