import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { api } from "~/utils/api"

// after user logs in, checks for profile, if none, opens create profile component
// user sets name, submits, pushes to game page

export const CreateProfile = () => { 
    const [showError, setShowError] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { mutate, isSuccess } = api.profile.createNewProfile.useMutation()
    const submitProfile = (e: any) => {
           if (nameRef.current != null && nameRef.current.value.length > 0) { 
                e.preventDefault()
                const name = nameRef.current.value
                console.log(name)
                mutate({ name })
            } else {
                setShowError(true)
            }
        
    }

    useEffect(() => {
        isSuccess && router.push('/game') 
    }, [isSuccess])

    return (
        <div className="flex flex-col text-center gap-2 items-center">
            <p className="text-white text-2xl font-bold">Create New Profile</p>
            <input 
                type='text'
                className="p-2 rounded-md"
                placeholder="Display Name"
                id="displayName"
                autoFocus 
                ref={nameRef}
            />
            {showError && <p className="text-red-700 text-sm">Please enter a valid name</p>}
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
    )
}