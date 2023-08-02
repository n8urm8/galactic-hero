import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Head from "next/head";
import { MainLayout } from "~/components/layout";
//className="bg-gradient-to-b from-[#2e026d] to-[#15162c]"
const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>Galactic Hero</title>
                <meta name="description" content="Idle, space defender game" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
