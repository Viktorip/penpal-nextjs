'use client'
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";
import { useContext, useEffect } from "react";
import { AuthContext, LocalizationContext } from "../layout";
import { logout } from "../actions";


export default function LogoutPage() {
    const { loc, setLoc } = useContext(LocalizationContext);
    const { user, setUser } = useContext(AuthContext);

    useEffect(()=>{
        const handleLogout = async ()=> {
            await logout();
            setUser({});
        }
        handleLogout();
    }, []);

    return (
        <PageContainer>
            <div>{t('logout_success', loc)}</div>
        </PageContainer>
    )
} 