import { useEffect, useState } from "react";
import { EventEmitter, GameEvents, SceneEvents } from "~/utils/events";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { AuthShowcase } from ".";
import { GameCanvas } from "~/game";
import {
    AfkRewards,
    ButtonMenu,
    Crafting,
    Inventory,
    ItemOverview,
    PlayerStats,
} from "~/components/gameMenu";
import { Button } from "~/components/button";
import Image from "next/image";
import { PlayerEquipment } from "~/utils/gameTypes";
import { Modal } from "~/components/modal";
import { ItemButtons } from "~/components/gameMenu/itemButtons";
import random from "random-bigint";
import { useRouter } from "next/router";
import { gradientPrimary } from "~/styles/cssVariables";
//import GHLogo from "/static/images/GHLogo.png";

const Game = () => {
    const router = useRouter();
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
    const rankingAPI = api.waveInfo.waveRankings.useQuery();
    const gameSessionAPI = api.profile.updateGameSession.useMutation();
    const vanguardAPI = api.vanguard.completeVanguard.useMutation();

    const [gameWidth, setGameWith] = useState(800);
    const [gameHeight, setGameHeight] = useState(600);
    const [currentGameSession, setCurrentGameSession] = useState("");
    useEffect(() => {
        if (window.innerWidth <= 400) {
            setGameWith(330);
            setGameHeight(450);
        }
        const updateGameSession = async () => {
            const bigint = random(128).toString() as string;
            await gameSessionAPI.mutateAsync({ newSession: bigint });
            setCurrentGameSession(bigint);
        };
        process.env.NODE_ENV !== "development" &&
            updateGameSession().catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (currentGameSession !== "" && profile.data) {
            if (currentGameSession !== profile.data.gameSession) {
                router.push("/");
            }
        }
    }, [profile.data]);

    //console.log("game session", profile.data);
    const emitter = EventEmitter.getInstance();

    const waves = api.waveInfo.updateWaveCount.useMutation();
    const loadProfile = () => {
        emitter.emit(GameEvents.profileLoaded, profile.data);
    };
    emitter.on(
        GameEvents.getProfile,
        loadProfile,
        emitter.removeListener(GameEvents.getProfile)
    );
    //vanguard
    emitter.on(
        SceneEvents.vanguardEnded,
        async (data: { level: number }) => {
            await vanguardAPI.mutateAsync({ level: data.level });
            await profile.refetch();
        },
        emitter.removeListener(SceneEvents.vanguardEnded)
    );

    emitter.on(
        SceneEvents.waveCompleted,

        async () => {
            const result = await waves.mutateAsync({ amount: 1 });
            await profile.refetch();
            emitter.emit(GameEvents.waveCountUpdated, {
                waves: result.waves,
            });
        },
        emitter.removeListener(SceneEvents.waveCompleted)
    );

    emitter.on(
        GameEvents.refreshProfile,
        async () => {
            console.log("refresh profile");
            const result = await profile.refetch();
            const shipUpdate = await currentShipAPI.refetch();
            emitter.emit(GameEvents.profileLoaded, result.data);
        },
        emitter.removeListener(GameEvents.refreshProfile)
    );

    return (
        <div
            className="bg-cover bg-fixed"
            style={{
                backgroundImage:
                    "url('static/images/backgrounds/spacefightBG1.jpg')",
            }}
        >
            <div className="relative flex min-h-screen flex-col bg-black bg-opacity-70 p-2 pt-10 max-[400px]:pt-12 ">
                {profile.isLoading ? (
                    <div className="my-auto flex justify-center text-center">
                        <p>Loading...</p>
                    </div>
                ) : profile?.data == undefined || profile.data == null ? (
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
                    <div className="relative flex flex-row gap-2 max-[400px]:mb-1 max-[400px]:max-w-none  max-[400px]:flex-col-reverse">
                        <AfkRewards />
                        <div className="flex h-full max-w-[350px] flex-col items-center justify-center gap-2 bg-transparent p-2 max-[400px]:max-w-none">
                            <div className=" w-full  rounded-md bg-slate-600 bg-opacity-50">
                                <div
                                    className={`rounded-t-md px-2 text-white ${gradientPrimary}`}
                                >
                                    Overview
                                </div>
                                <div className={` px-2`}>
                                    <PlayerStats
                                        name={profile.data.name}
                                        waves={profile.data.waves}
                                        credits={profile.data.credits}
                                        rankings={rankingAPI.data}
                                    />
                                </div>
                                <div className="px-2 pb-2">
                                    <ItemOverview
                                        item={currentShipAPI.data.ships[0]}
                                        currentShip={true}
                                        clickable={true}
                                        currentCredits={profile.data.credits}
                                    />
                                </div>
                            </div>
                            <Inventory
                                ships={profile.data.ships}
                                equipment={profile.data.equipment}
                                currentCredits={profile.data.credits}
                            />
                            <div className="w-full">
                                <Crafting
                                    resources={{
                                        credits: profile.data.credits,
                                        metal: profile.data.craftingMaterials
                                            .metal,
                                        energy: profile.data.craftingMaterials
                                            .energy,
                                        gilding:
                                            profile.data.craftingMaterials
                                                .gilding,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col px-2">
                            <div
                                id="canvas-wrapper"
                                className="mx-auto  min-h-[250px] min-w-[800px] snap-y snap-mandatory rounded-md max-[400px]:w-full max-[400px]:min-w-0"
                            >
                                <GameCanvas
                                    gameHeight={gameHeight}
                                    gameWidth={gameWidth}
                                />
                            </div>
                            <ButtonMenu />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Game;
