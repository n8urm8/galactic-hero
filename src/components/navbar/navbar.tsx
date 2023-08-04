import Link from "next/link";
import React from "react";
import { Button } from "../button";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";

export const Navbar = ({ transparent }: { transparent: boolean }) => {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const { data: sessionData } = useSession();
    const profileAPI = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user !== undefined,
    });
    const profile = profileAPI.data;
    const router = useRouter();
    return (
        <nav
            className={
                (transparent
                    ? "absolute top-0 z-50 w-full"
                    : "relative bg-white shadow-lg") +
                " flex flex-wrap items-center justify-between px-2  "
            }
        >
            <div className="container mx-auto flex flex-wrap items-center justify-end px-4 lg:justify-between">
                <div className="relative flex w-full justify-between lg:static lg:block lg:w-auto lg:justify-start">
                    <Link
                        className={
                            (transparent ? "text-white" : "text-gray-800") +
                            " mr-4 inline-block whitespace-nowrap text-sm font-bold uppercase leading-relaxed"
                        }
                        href="/"
                    >
                        <Image
                            src={"/static/images/GHLogo.png"}
                            alt="Galactic Hero"
                            width={250}
                            height={50}
                        />
                    </Link>
                    <button
                        className="block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none outline-none focus:outline-none lg:hidden"
                        type="button"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        <i
                            className={
                                (transparent ? "text-white" : "text-gray-800") +
                                " fas fa-bars"
                            }
                        ></i>
                    </button>
                </div>
                <div
                    className={
                        "w-fit items-center bg-white pl-2 pr-3 pb-2  lg:flex lg:bg-transparent lg:shadow-none" +
                        (navbarOpen ? " block rounded shadow-lg" : " hidden")
                    }
                    id="navbar"
                >
                    <ul className="flex list-none flex-col justify-end lg:ml-auto lg:flex-row">
                        <li className="flex items-center">
                            <Link
                                target="_blank"
                                className={
                                    (transparent
                                        ? "text-gray-800 lg:text-white lg:hover:text-gray-300"
                                        : "text-gray-800 hover:text-gray-600") +
                                    " flex items-center px-3 py-4 text-xs font-bold uppercase lg:py-2"
                                }
                                href="https://discord.gg/YBhxXNhpE7"
                            >
                                <i
                                    className={
                                        (transparent
                                            ? "text-gray-500 lg:text-gray-300"
                                            : "text-gray-500") +
                                        " fa-brands fa-discord leading-lg text-lg "
                                    }
                                />
                                <span className="ml-2 inline-block lg:hidden">
                                    Discord
                                </span>
                            </Link>
                        </li>

                        <li className="ml-2 flex items-center">
                            {sessionData &&
                                !profileAPI.isLoading &&
                                router.pathname !== "/game" && (
                                    <Link
                                        href={profile ? "/game" : "/#register"}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="yellow"
                                        >
                                            {profile ? "Start Game" : "Join"}
                                        </Button>
                                    </Link>
                                )}
                            <Button
                                variant="outlined"
                                onClick={
                                    sessionData
                                        ? () => {
                                              signOut() && router.push("/");
                                          }
                                        : () => signIn()
                                }
                            >
                                {sessionData ? "Sign Out" : "Sign In"}
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
