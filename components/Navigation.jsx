'use client'
import Link from "next/link"
import LoginButton from "./LoginButton";
import { FaHome } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { BsMailbox2Flag } from "react-icons/bs";
import { RiMailSendFill } from "react-icons/ri";
import { useContext } from "react";
import { AuthContext, LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import Image from "next/image";

export default function Navigation({ className }) {
    const { user, setUser } = useContext(AuthContext);
    const { loc, setLoc } = useContext(LocalizationContext);

    const changeLocalization = (id) => {
        if (id === loc) return;
        setLoc(id);
    }

    return (
        <div className={`flex-none h-screen w-48 bg-blue-200 py-10 space-y-4 ${className}`}>
            <div className="flex flex-row space-x-4 p-2 justify-center">
                <div>
                    <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('en')}>
                        <Image
                            src="/en.png"
                            width={24}
                            height={24}
                            alt="In English"
                        />
                    </button>
                </div>
                <div>
                    <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('fi')}>
                        <Image
                            src="/fi.png"
                            width={24}
                            height={24}
                            alt="Suomeksi"
                        />
                    </button>
                </div>
                <div>
                    <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('vn')}>
                        <Image
                            src="/vn.png"
                            width={24}
                            height={24}
                            alt="Vietnamese"
                        />
                    </button>
                </div>
            </div>

            <IconContext.Provider value={{ color: "rgb(38, 85, 240)", size: "2em" }}>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/'><div className="flex items-center w-full h-full ml-4 space-x-4"><FaHome /><div>{t('navi_home_title')}</div></div></Link></div>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/inbox'><div className="flex items-center w-full h-full ml-4 space-x-4"><BsMailbox2Flag /><div>{t('navi_inbox_title')}</div></div></Link></div>
                <div className="border-solid hover:bg-green-200 border-y-2 border-indigo-700 relative h-14"><Link className="absolute top-0 left-0 w-full h-full" href='/compose'><div className="flex items-center w-full h-full ml-4 space-x-4"><RiMailSendFill /><div>{t('navi_compose_title')}</div></div></Link></div>
            </IconContext.Provider>
            <div className="text-center">
                {user?.id ? `${user.email}` : ''}
            </div>
            <div className="text-center">
                <LoginButton />
            </div>

        </div>
    )
}