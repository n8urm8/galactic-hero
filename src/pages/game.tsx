import { useEffect, useState } from "react"
import { Game as GameType } from 'phaser'
import { EventEmitter, GameEvents } from "~/utils/events"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { AuthShowcase } from "."
import Head from "next/head"
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export const [gameWidth, gameHeight] = [900, 400]

const Game = () => {
    const { data: sessionData } = useSession();
    const [game, setGame] = useState<GameType>()
    const emitter = EventEmitter.getInstance()
    
    const profile = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user != undefined
    })
    const waves = api.profile.updateWaveCount.useMutation()
    const loadProfile = async () =>{
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

    const levelUp = api.profile.shipLevelUp.useMutation()
    emitter.on(GameEvents.levelUpShip, async (data: {playerId: number, shipId: number}) => {
        //console.log('game.tsx level up', data)
        const levelingUp = await levelUp.mutateAsync({playerId: data.playerId, shipId: data.shipId})
        //console.log(levelingUp)
        emitter.emit(GameEvents.shipLeveled, { player: levelingUp })
        const result = await profile.refetch()
        emitter.emit(GameEvents.profileLoaded, result.data)
    }, emitter.removeListener(GameEvents.levelUpShip))

    const getRandomEquip = api.profile.getRandomT1Equipment.useMutation()
    emitter.on(GameEvents.getRandomEquipment, async (data: {playerId: number, shipId: number}) => {
        //console.log('game.tsx level up', data)
        const newEquip = await getRandomEquip.mutateAsync()
        //console.log(levelingUp)
        emitter.emit(GameEvents.loadNewEquipment, newEquip)
        const result = await profile.refetch()
        emitter.emit(GameEvents.profileLoaded, result.data)
    }, emitter.removeListener(GameEvents.getRandomEquipment))
    
    useEffect(() => {
        async function initPhaser(){
            const Phaser = await import('phaser')
            const {default: BootScene} = await import('../game/scenes/BootScene')
            const {default: GameScene} = await import('../game/scenes/GameScene')
            const {default: WaveScene} = await import('../game/scenes/WaveScene')
            const {default: EndWaveScene} = await import('../game/scenes/EndWaveScene')
            const {default: UpgradeMenuScene} = await import('../game/scenes/upgradeMenu')
            const {default: InventoryScene} = await import('../game/scenes/InventoryScene')

            const phaserGame = new Phaser.Game({
                title: 'Galatic Hero',
                // width: Math.min(window.innerHeight*2.25, gameWidth),
                // height: Math.min(window.innerWidth/2.25, gameHeight),
                type: Phaser.AUTO,
                parent: 'game-content',
                scene: [BootScene, GameScene, WaveScene, EndWaveScene, UpgradeMenuScene, InventoryScene],
                backgroundColor: '#000',
                pixelArt: true,
                physics: {
                    default: "arcade",
                    arcade:{
                        debug: true,
                        gravity: {y: 0},
                        debugShowVelocity: true
                    }
                },
                scale: {
                    mode: Phaser.Scale.FIT,
                    width: gameWidth,
                    height: gameHeight,
                    zoom: 1,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                },
            })
            setGame(phaserGame)
        }
        game == undefined && initPhaser()
        return () => {}
    }, [game])

    return (
        <div 
            className="w-full min-h-screen relative bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center flex-col justify-center"
        >
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

            <div id='game-content' key='game-content' className="w-full h-full block">

            </div>
            
        </div>
    )
}

export default Game