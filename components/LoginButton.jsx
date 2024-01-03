'use client'
import { logout } from "@/app/actions";
import { AuthContext } from "@/app/layout";
import t from "@/lib/localization";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function LoginButton({className}) {
    const router = useRouter();
    const { user, setUser } = useContext(AuthContext);
    const loggedIn = !!user.id;

    const logoutHandler = async () => {
        await logout();
        setUser({});
        router.push('/logout');
    }

    const loginHandler = () => {
        router.push('/login');
    }
    return (
        <div>
            {loggedIn ?
                <button className={className} onClick={logoutHandler}>
                    {t('navi_logout_btn')}
                </button>
                :
                <button className={className} onClick={loginHandler}>
                    {t('navi_login_btn')}
                </button>
            }
        </div>
    )
}