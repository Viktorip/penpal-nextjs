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
        <div className={`sticky top-0 w-full z-10 bg-black p-4 ${className}`}>

            <div className="flex flex-row justify-end items-center">
                <div className="text-center">
                    <LoginButton className="p-1 text-white bg-transparent text-center hover:text-gray-400 text-sm w-24" />
                </div>
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
            <div className="flex flex-row justify-center space-x-12 text-white">
                <Link className="hover:text-gray-400" href='/'>{t('navi_home_title')}</Link>
                <Link className="hover:text-gray-400" href='/inbox'>{t('navi_inbox_title')}</Link>
                <Link className="hover:text-gray-400" href='/compose'>{t('navi_compose_title')}</Link>
            </div>

        </div>
    )
}