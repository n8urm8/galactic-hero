import Link from "next/link";
import React from "react";

export function Footer() {
    return (
        <footer className="relative bg-gray-300 pt-8 pb-6">
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
                        className="fill-current text-gray-300"
                        points="2560 0 2560 100 0 100"
                    ></polygon>
                </svg>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-end">
                    <div className="w-full px-4 text-right lg:w-6/12">
                        <h4 className="text-3xl font-semibold">
                            Join our community!
                        </h4>
                        <h5 className="mt-0 mb-2 text-lg text-gray-700">
                            Join us on discord for the latest updates and to
                            meet fellow heroes!
                        </h5>
                        <div className="mt-6">
                            <Link
                                target="_blank"
                                className="align-center h-10 w-10 items-center justify-center rounded-full bg-white p-2  font-normal shadow-lg outline-none focus:outline-none"
                                href="https://discord.gg/2WHatYn9hC"
                            >
                                <i className="fa-brands fa-discord"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-400" />
                <div className="flex flex-wrap items-center justify-center md:justify-between">
                    <div className="mx-auto w-full px-4 text-center md:w-4/12">
                        <div className="py-1 text-sm font-semibold text-gray-600">
                            Copyright © {new Date().getFullYear()} Galactic Hero
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
