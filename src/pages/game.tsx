import { Suspense, useEffect, useState } from "react";
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
import { CanvasLoader } from "~/components/loaders";
import { PlayerEquipment } from "~/utils/gameTypes";
import { Modal } from "~/components/modal";
import { ItemButtons } from "~/components/gameMenu/itemButtons";
//import GHLogo from "/static/images/GHLogo.png";

const Game = () => {
    const { data: sessionData } = useSession();
    const profile = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user != undefined,
    });
    const currentShipAPI = api.profile.getPlayerCurrentShip.useQuery(
        undefined,
        {
            enabled: sessionData?.user != undefined,
        }
    );
    const getRandomEquipmentAPI =
        api.profile.getRandomT1Equipment.useMutation();
    const [newEquipment, setNewEquipment] = useState<PlayerEquipment>(
        {} as PlayerEquipment
    );
    //console.log("current ship", currentShip.data);
    const emitter = EventEmitter.getInstance();

    const waves = api.profile.updateWaveCount.useMutation();
    const loadProfile = () => {
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
            const result = await waves.mutateAsync({ amount: 1 });
            await profile.refetch();
            emitter.emit(GameEvents.waveCountUpdated, {
                waves: result.waves,
            });
        },
        emitter.removeListener(GameEvents.waveCompleted)
    );

    emitter.on(
        GameEvents.refreshProfile,
        async () => {
            console.log("refresh profile");
            const result = await profile.refetch();
            const shipUpdate = await currentShipAPI.refetch();
        },
        emitter.removeListener(GameEvents.refreshProfile)
    );

    const getNewRandEquipment = async () => {
        const newEquip = await getRandomEquipmentAPI.mutateAsync();
        await profile.refetch();
        setNewEquipment(newEquip!);
    };

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
                ) : currentShipAPI.isFetched &&
                  currentShipAPI.data?.ships[0] ? (
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
                                item={currentShipAPI.data.ships[0]}
                                currentShip={true}
                                clickable={true}
                                currentCredits={profile.data.credits}
                            />

                            <Inventory
                                ships={profile.data.ships}
                                equipment={profile.data.equipment}
                                currentCredits={profile.data.credits}
                            />
                            <Button
                                onClick={() => getNewRandEquipment()}
                                disabled={
                                    getRandomEquipmentAPI.isLoading ||
                                    profile.data.credits < 100
                                }
                            >
                                Buy Equipment - 100 credits
                            </Button>
                        </div>
                        <Suspense fallback={<CanvasLoader />}>
                            <GameCanvas />
                        </Suspense>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Game;
