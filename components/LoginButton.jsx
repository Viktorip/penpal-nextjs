'use client'
import { logout } from "@/app/actions";
import { AuthContext } from "@/app/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function LoginButton() {
    const router = useRouter();
    const {user, setUser} = useContext(AuthContext);
    const loggedIn = !!user.id;
    
    const submitHandler = async () => {
        await logout();
        setUser({});
        router.push('/');
    }
    return (
        <div>
            {loggedIn ?
                <form action={submitHandler}>
                    <button className="border-solid hover:bg-red-400 border-2 border-red-700 p-1 rounded-md w-24 bg-red-200 text-black-700 text-center">
                        Sign out
                    </button>
                </form>
                :
                <button className="border-solid hover:bg-blue-400 border-2 border-indigo-700 p-1 rounded-md w-24 bg-white text-blue-700 text-center">

                    <Link href='/login'>Sign in</Link>
                </button>
            }
        </div>
    )
}