import { useEffect, useState } from "react";
import { Game as GameType } from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { AuthShowcase } from ".";
import Head from "next/head";
import { GameCanvas } from "~/game";
import { Inventory, ItemOverview, PlayerStats } from "~/components/gameMenu";
import { Button } from "~/components/button";
import Image from "next/image";
//import GHLogo from "/static/images/GHLogo.png";

const Game = () => {
    const { data: sessionData } = useSession();
    const profile = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user != undefined,
    });
    const currentShip = api.profile.getPlayerCurrentShip.useQuery(undefined, {
        enabled: sessionData?.user != undefined,
    });
    //console.log("current ship", currentShip.data);
    const emitter = EventEmitter.getInstance();

    const waves = api.profile.updateWaveCount.useMutation();
    const loadProfile = async () => {
        emitter.emit(GameEvents.profileLoaded, profile.data);
    };
    emitter.on(
        GameEvents.getProfile,
        loadProfile,
        emitter.removeListener(GameEvents.getProfile)
    );

    emitter.on(
        GameEvents.waveCompleted,
        async () => {
            //console.log('game.tsx waveCompletedDB')
            let result = await waves.mutateAsync({ amount: 1 });

            emitter.emit(GameEvents.waveCountUpdated, { waves: result.waves });
        },
        emitter.removeListener(GameEvents.waveCompleted)
    );

    const levelUp = api.profile.shipLevelUp.useMutation();
    emitter.on(
        GameEvents.levelUpShip,
        async (data: { playerId: number; shipId: number }) => {
            //console.log('game.tsx level up', data)
            const levelingUp = await levelUp.mutateAsync({
                playerId: data.playerId,
                shipId: data.shipId,
            });
            //console.log(levelingUp)
            emitter.emit(GameEvents.shipLeveled, { player: levelingUp });
            const result = await profile.refetch();
            const shipUpdate = await currentShip.refetch();
            emitter.emit(GameEvents.profileLoaded, result.data);
        },
        emitter.removeListener(GameEvents.levelUpShip)
    );

    const getRandomEquip = api.profile.getRandomT1Equipment.useMutation();
    emitter.on(
        GameEvents.getRandomEquipment,
        async (data: { playerId: number; shipId: number }) => {
            //console.log('game.tsx level up', data)
            const newEquip = await getRandomEquip.mutateAsync();
            //console.log(levelingUp)
            emitter.emit(GameEvents.loadNewEquipment, newEquip);
            const result = await profile.refetch();
            emitter.emit(GameEvents.profileLoaded, result.data);
        },
        emitter.removeListener(GameEvents.getRandomEquipment)
    );

    const equipItemAPI = api.profile.updateShipEquipment.useMutation();
    emitter.on(
        GameEvents.equipItem,
        async (data: { playerId: number; itemId: number }) => {
            await equipItemAPI.mutateAsync({
                playerId: data.playerId,
                equipmentIdAdd: data.itemId,
            });
            const result = await profile.refetch();
            emitter.emit(GameEvents.profileLoaded, result.data);
        },
        emitter.removeListener(GameEvents.equipItem)
    );

    const equipmentLevelUpAI = api.profile.equipmentLevelUp.useMutation();
    emitter.on(
        GameEvents.levelUpEquipment,
        async (data: { itemId: number }) => {
            const newEquipment = await equipmentLevelUpAI.mutateAsync({
                equipmentId: data.itemId,
            });
            const result = await profile.refetch();
            emitter.emit(GameEvents.profileLoaded, result.data);
        },
        emitter.removeListener(GameEvents.levelUpEquipment)
    );

    return (
        <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="relative mx-auto flex min-h-screen w-fit flex-col p-2">
                <Head>
                    <title>Galactic Hero</title>
                    <meta
                        name="description"
                        content="Idle, space defender game"
                    />
                    <link rel="icon" href="/favicon.png" />
                </Head>
                {profile?.data == undefined || profile.data == null ? (
                    <div className="fixed top-0 z-10 h-full w-full items-center bg-slate-500 bg-opacity-5 p-6 text-center">
                        <div className="h-fit w-full items-center bg-slate-900 bg-opacity-75 p-6 text-center">
                            <p className="text-2xl font-semibold text-white">
                                You must login and create a profile before
                                playing
                            </p>
                            <AuthShowcase />
                        </div>
                    </div>
                ) : currentShip.isFetched ? (
                    <div className="relative flex  w-full flex-row gap-2">
                        <div className="flex h-full flex-col gap-2 bg-transparent p-2">
                            <Image
                                src={"/static/images/GHLogo.png"}
                                height={250}
                                width={250}
                                alt="Galactic Hero"
                            />
                            <PlayerStats
                                name={profile.data.name}
                                waves={profile.data.waves}
                                credits={profile.data.credits}
                            />
                            <ItemOverview
                                item={currentShip.data?.ships[0]!}
                                currentShip={true}
                            />

                            <Inventory
                                ships={profile.data.ships}
                                equipment={profile.data.equipment}
                            />
                            {/* <Button>Start Wave</Button> */}
                        </div>
                        <GameCanvas />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Game;
