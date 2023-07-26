import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

// after user logs in, checks for profile, if none, opens create profile component
// user sets name, submits, pushes to game page

interface ICreateProfile {
    defaultName: string;
}

export const CreateProfile: React.FC<ICreateProfile> = ({ defaultName }) => {
    const [showError, setShowError] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { mutate, isSuccess } = api.profile.createNewProfile.useMutation();
    const submitProfile = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (nameRef.current != null && nameRef.current.value.length > 0) {
            e.preventDefault();
            const name = nameRef.current.value;
            console.log(name);
            mutate({ name });
        } else {
            setShowError(true);
        }
    };

    useEffect(() => {
        isSuccess && router.push("/game").catch((e) => console.error(e));
    }, [isSuccess, router]);

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold text-white">Create New Profile</p>
            <input
                type="text"
                className="rounded-md p-2"
                placeholder={defaultName}
                defaultValue={defaultName}
                id="displayName"
                autoFocus
                ref={nameRef}
            />
            {showError && (
                <p className="text-sm text-red-700">
                    Please enter a valid name
                </p>
            )}
            <button
                className="w-fit rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(e) => submitProfile(e)}
            >
                Start Game
            </button>
            {/* <Link
                href={'/game'}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
                Game On!
            </Link> */}
        </div>
    );
};
