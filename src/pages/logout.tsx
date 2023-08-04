import { NextPage } from "next";

const Logout: NextPage = () => {
    return (
        <div className="bg- flex min-h-screen w-full justify-center bg-slate-400">
            <p className="my-auto font-bold text-black">
                You have been logged out
            </p>
        </div>
    );
};

export default Logout;
