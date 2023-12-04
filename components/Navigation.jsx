'use client'
import Link from "next/link"
import LoginButton from "./LoginButton";
import { FaHome } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { BsMailbox2Flag } from "react-icons/bs";
import { RiMailSendFill } from "react-icons/ri";
import { useContext } from "react";
import { AuthContext } from "@/app/layout";

export default function Navigation({className}) {
    const {user, setUser} = useContext(AuthContext);

    return (
        <div className={`flex-none h-screen w-48 bg-blue-200 py-10 space-y-4 ${className}`}>
            <IconContext.Provider value={{ color: "rgb(38, 85, 240)", size: "2em" }}>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/'><div className="flex items-center w-full h-full ml-4 space-x-4"><FaHome /><div>Home</div></div></Link></div>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/inbox'><div className="flex items-center w-full h-full ml-4 space-x-4"><BsMailbox2Flag /><div>Inbox</div></div></Link></div>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/compose'><div className="flex items-center w-full h-full ml-4 space-x-4"><RiMailSendFill /><div>Write a letter</div></div></Link></div>
            </IconContext.Provider>
            <div className="text-center">
                {user?.id ? `Logged in as ${user.email}` : ''}
            </div>
            <div className="text-center">
                <LoginButton />
            </div>

        </div>
    )
}