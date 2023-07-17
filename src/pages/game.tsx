import { useEffect, useState } from "react";
import { Game as GameType } from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthShowcase } from ".";
import Head from "next/head";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { GameCanvas } from "~/game";

const Game = () => {
    const { data: sessionData } = useSession();
    const profile = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user != undefined,
    });

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <Head>
                <title>Galactic Hero</title>
                <meta name="description" content="Idle, space defender game" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            {profile?.data == undefined && (
                <div className="fixed top-0 z-10 h-full w-full items-center bg-slate-500 bg-opacity-5 p-6 text-center">
                    <div className="h-fit w-full items-center bg-slate-900 bg-opacity-75 p-6 text-center">
                        <p className="text-2xl font-semibold text-white">
                            You must login and create a profile before playing
                        </p>
                        <AuthShowcase />
                    </div>
                </div>
            )}
            <GameCanvas />
        </div>
    );
};

export default Game;
