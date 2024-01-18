'use client'
import Link from "next/link"
import { useContext, useState } from "react";
import { AuthContext, LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions";

export default function Navigation({ className }) {
    const { user, setUser } = useContext(AuthContext);
    const { loc, setLoc } = useContext(LocalizationContext);
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    const changeLocalization = (id) => {
        if (id === loc) return;
        setLoc(id);
    }

    return (
        <div className={`sticky top-0 w-full z-10 bg-[url('/background_paper_big.png')] ${className}`}>
            <div className="flex flex-col w-full sm:h-48 sm:bg-[url('/navi_paper_torn.png')] bg-contain bg-no-repeat bg-top">

                <div className="sm:hidden relative">
                    <div className="flex flex-row justify-end p-4">
                        <div className={`hover:ring hover:bg-gray-200 ${showMenu && 'pointer-events-none'}`} onClick={() => setShowMenu(!showMenu)}>
                            <IoMdMenu className="text-5xl text-indigo-900" />
                        </div>
                        {showMenu &&
                            <div>
                                <div className="absolute top-0 left-0 w-screen h-screen bg-gray-500 z-0 opacity-75" onClick={()=>setShowMenu(false)}></div>
                                <div className="absolute top-0 left-0 w-screen p-1 z-50">
                                    <div className="w-full p-2 border-2 border-indigo-200 bg-indigo-100 text-indigo-900">
                                        <div className="relative w-full p-6 border-b-2 border-indigo-200 last:border-b-0 hover:bg-gray-400" onClick={() => setShowMenu(false)}><Link className="absolute top-1/4 text-lg w-screen" href='/'>{t('navi_home_title', loc)}</Link></div>
                                        <div className="relative w-full p-6 border-b-2 border-indigo-200 last:border-b-0 hover:bg-gray-400" onClick={() => setShowMenu(false)}><Link className="absolute top-1/4 text-lg w-full" href='/inbox'>{t('navi_inbox_title', loc)}</Link></div>
                                        <div className="relative w-full p-6 border-b-2 border-indigo-200 last:border-b-0 hover:bg-gray-400" onClick={() => setShowMenu(false)}><Link className="absolute top-1/4 text-lg w-full" href='/compose'>{t('navi_compose_title', loc)}</Link></div>

                                        <div className="text-center mt-2">
                                            <div className="ml-2 text-sm text-indigo-900">
                                                {user && <span>{user.email}</span>}
                                            </div>
                                            <LoginButton className="p-1 text-indigo-900 bg-transparent text-center text-sm w-24 hover:bg-gray-200 hover:ring" callback={()=>setShowMenu(false)} router={router} setUser={setUser} loggedIn={!!user._id} loc={loc} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center max-sm:absolute max-sm:top-0 max-sm:left-0 max-sm:pt-4">
                    <div className="max-sm:hidden ml-2 text-xs sm:text-sm text-indigo-900">
                        {user && <span>{user.email}</span>}
                    </div>
                    <div className="flex flex-row sm:justify-end items-center mr-2 max-sm:space-x-2">
                        <div className="text-center max-sm:hidden">
                            <LoginButton className="p-1 text-indigo-900 bg-transparent text-center text-xs sm:text-sm w-20 sm:w-24 hover:bg-gray-200 hover:ring" router={router} setUser={setUser} loggedIn={!!user._id} loc={loc} />
                        </div>
                        <div>
                            <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('fi')}>
                                <Image
                                    src="/fi.png"
                                    width={20}
                                    height={20}
                                    alt="Suomeksi"
                                />
                            </button>
                        </div>
                        <div>
                            <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('en')}>
                                <Image
                                    src="/en.png"
                                    width={20}
                                    height={20}
                                    alt="In English"
                                />
                            </button>
                        </div>
                        <div>
                            <button className="border-4 border-transparent rounded-full hover:border-indigo-500/50" onClick={() => changeLocalization('vn')}>
                                <Image
                                    src="/vn.png"
                                    width={20}
                                    height={20}
                                    alt="Vietnamese"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-row justify-center items-center sm:space-x-10 space-x-4 max-sm:mt-2 sm:mt-4 max-sm:ml-10 sm:ml-20 text-indigo-900 max-sm:hidden`}>
                    <div><Link className="text-sm sm:text-lg p-2 hover:bg-gray-200 hover:ring" href='/'>{t('navi_home_title', loc)}</Link></div>
                    <div><Link className="text-sm sm:text-lg p-2 hover:bg-gray-200 hover:ring" href='/inbox'>{t('navi_inbox_title', loc)}</Link></div>
                    <div><Link className="text-sm sm:text-lg p-2 hover:bg-gray-200 hover:ring" href='/compose'>{t('navi_compose_title', loc)}</Link></div>
                </div>
            </div>
        </div>
    )
}

const LoginButton = ({className, router, setUser, loc, loggedIn, callback = ()=>{}}) => {

    const logoutHandler = async () => {
        await logout();
        setUser({});
        callback();
        router.push('/logout');
    }

    const loginHandler = () => {
        callback();
        router.push('/login');
    }
    return (
        <div>
            {loggedIn ?
                <button className={className} onClick={logoutHandler}>
                    {t('navi_logout_btn', loc)}
                </button>
                :
                <button className={className} onClick={loginHandler}>
                    {t('navi_login_btn', loc)}
                </button>
            }
        </div>
    )
}