import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { CreateProfile } from "~/components/profile/CreateProfile";
import { Button } from "~/components/button";

const Home: NextPage = () => {
    return (
        <main>
            <div
                className="relative flex content-center items-center justify-center pt-16 pb-32"
                style={{
                    minHeight: "75vh",
                }}
            >
                <div
                    className="absolute top-0 h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('static/images/backgrounds/spacefightBG1.jpg')",
                    }}
                >
                    <span
                        id="blackOverlay"
                        className="absolute h-full w-full bg-black opacity-60"
                    ></span>
                </div>
                <div className="container relative mx-auto">
                    <div className="flex flex-wrap items-center">
                        <div className="ml-auto mr-auto w-full px-4 text-center lg:w-6/12">
                            <div className="pr-12">
                                <h1 className="text-6xl font-bold text-white">
                                    Galactic Hero
                                </h1>
                                <p className="mt-4 text-lg text-gray-300">
                                    Idle space defender game
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="pointer-events-none absolute top-auto bottom-0 left-0 right-0 w-full overflow-hidden"
                    style={{ height: "70px" }}
                >
                    <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            className="fill-current text-gray-300"
                            points="2560 0 2560 100 0 100"
                        ></polygon>
                    </svg>
                </div>
            </div>

            <section className="-mt-24 bg-gray-300 pb-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap">
                        <div className="w-full px-4 pt-6 text-center md:w-4/12 lg:pt-12">
                            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
                                <div className="flex-auto px-4 py-5">
                                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-400 p-3 text-center text-white shadow-lg">
                                        🏆
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Compete
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Prove your mettle in intense weekly
                                        tournaments and climb the ranks to
                                        become the ultimate Galactic Hero!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full px-4 text-center md:w-4/12">
                            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
                                <div className="flex-auto px-4 py-5">
                                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 p-3 text-center text-white shadow-lg">
                                        💫
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Form Galactic Alliances
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Team up with players from across the
                                        cosmos to form powerful alliances. Share
                                        resources, coordinate attacks, and
                                        strategize together to conquer
                                        challenging boss battles and reach new
                                        frontiers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="-mt-4 w-full px-4 pt-6 text-center md:w-4/12">
                            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
                                <div className="flex-auto px-4 py-5">
                                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-400 p-3 text-center text-white shadow-lg">
                                        🌟
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Idle, Upgrade, Conquer
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Witness the breathtaking spectacle of
                                        space combat without breaking a sweat!
                                        Continuously upgrade your ship and
                                        improve your equipment to fend off
                                        increasingly formidable foes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative bg-[#161d51] py-20">
                <div
                    className="pointer-events-none absolute bottom-auto top-0 left-0 right-0 -mt-20 w-full overflow-hidden"
                    style={{ height: "80px" }}
                >
                    <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            className="fill-current text-[#161d51]"
                            points="2560 0 2560 100 0 100"
                        ></polygon>
                    </svg>
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="ml-auto mr-auto w-full px-4 md:w-4/12">
                            <img
                                alt="..."
                                className="max-w-full rounded-lg shadow-lg"
                                src="static/images/backgrounds/ghBossBattle.jpg"
                            />
                        </div>
                        <div className="ml-auto mr-auto w-full px-4 md:w-5/12">
                            <div className="md:pr-12">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-3 text-center text-black shadow-lg">
                                    <i className="fas fa-rocket text-xl"></i>
                                </div>
                                <h3 className="text-3xl font-semibold text-slate-100">
                                    A Threat Approaches
                                </h3>
                                <p className="mt-4 text-lg leading-relaxed text-gray-400">
                                    Launch into a thrilling cosmic adventure
                                    with Galactic Hero, the ultimate idle
                                    defense web game! As the commander of an
                                    elite fleet, your mission is to defend our
                                    galaxy against the relentless onslaught of
                                    alien invaders. Can you rise to the
                                    challenge and protect the universe from the
                                    forces of darkness?
                                </p>
                                <ul className="mt-6 list-none">
                                    <li className="py-2">
                                        <div className="flex items-center">
                                            <div>
                                                <span className="mr-3 inline-block rounded-full bg-slate-100 py-1 px-2 text-xs font-semibold uppercase text-black">
                                                    <i className="fas fa-arrows-rotate"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400">
                                                    Endless waves of enemies
                                                </h4>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="py-2">
                                        <div className="flex items-center">
                                            <div>
                                                <span className="mr-3 inline-block rounded-full bg-slate-100 py-1 px-2 text-xs font-semibold uppercase text-black">
                                                    <i className="fa-solid fa-screwdriver-wrench"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400">
                                                    Craft epic equipment
                                                </h4>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="py-2">
                                        <div className="flex items-center">
                                            <div>
                                                <span className="mr-3 inline-block rounded-full bg-slate-100 py-1 px-2 text-xs font-semibold uppercase text-black">
                                                    <i className="fas fa-crown"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400">
                                                    Become the best
                                                </h4>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative block bg-gray-900 pb-10">
                <div
                    className="pointer-events-none absolute bottom-auto top-0 left-0 right-0 -mt-20 w-full overflow-hidden"
                    style={{ height: "80px" }}
                >
                    <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            className="fill-current text-gray-900"
                            points="2560 0 2560 100 0 100"
                        ></polygon>
                    </svg>
                </div>

                <div className="container mx-auto px-4 lg:pt-24 lg:pb-24">
                    <div className="flex flex-wrap justify-center text-center">
                        <div className="w-full px-4 lg:w-6/12">
                            <h2 className="text-4xl font-semibold text-white">
                                Time to Embrace Your Destiny
                            </h2>
                            <p className="mt-4 mb-4 text-lg leading-relaxed text-gray-500">
                                The fate of the galaxy rests in your hands. Will
                                you be the legendary commander who rises to the
                                challenge and leads the Space Guardians to
                                victory? Play now and prepare for an
                                exhilarating idle defense experience that will
                                leave you on the edge of your seat!
                            </p>
                        </div>
                    </div>
                    <AuthShowcase />
                </div>
            </section>
        </main>
    );
};

export default Home;

export const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
    const profileAPI = api.profile.getProfile.useQuery(undefined, {
        enabled: sessionData?.user !== undefined,
    });
    const profile = profileAPI.data;

    if (sessionData && profileAPI.isLoading) return <></>;
    return (
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
            {sessionData && !profile && (
                <CreateProfile defaultName={sessionData.user.name || ""} />
            )}
            {sessionData && profile && (
                <Link href={"/game"}>
                    <Button color="yellow">Start Game</Button>
                </Link>
            )}
            {!sessionData && (
                <Button onClick={() => void signIn()}>Sign in</Button>
            )}
        </div>
    );
};
