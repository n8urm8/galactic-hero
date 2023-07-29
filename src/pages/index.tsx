import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Game as GameType } from "phaser";

import { api } from "~/utils/api";
import config from "next/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CreateProfile } from "~/components/profile/CreateProfile";
import { Button } from "~/components/button";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Galactic Hero</title>
                <meta name="description" content="Idle, space defender game" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Galactic Hero
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <AuthShowcase />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

export const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
    const profileAPI = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user !== undefined,
    });
    const profile = profileAPI.data;

    if (profileAPI.isLoading) return <></>;
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {sessionData && !profile && (
                <CreateProfile defaultName={sessionData.user.name || ""} />
            )}
            {sessionData && profile && (
                <Link href={"/game"}>
                    <Button>Start Game</Button>
                </Link>
            )}
            <p className="text-center text-xl text-white ">
                {sessionData && (
                    <span>Logged in as {sessionData.user?.name}</span>
                )}
            </p>
            <Button
                onClick={
                    sessionData ? () => void signOut() : () => void signIn()
                }
            >
                {sessionData ? "Sign out" : "Sign in"}
            </Button>
        </div>
    );
};
