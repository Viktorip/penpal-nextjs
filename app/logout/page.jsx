'use client'
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";
import { useContext } from "react";
import { LocalizationContext } from "../layout";


export default function LogoutPage() {
    const { loc, setLoc } = useContext(LocalizationContext);
    return (
        <PageContainer>
            <div>{t('logout_success', loc)}</div>
        </PageContainer>
    )
} 