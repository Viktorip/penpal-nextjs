'use client'
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";
import { useContext } from "react";
import { LocalizationContext } from "../layout";


export default function SuccessPage() {
    const { loc, setLoc } = useContext(LocalizationContext);

    return (
        <PageContainer>
            {t('letter_success_title', loc)}
        </PageContainer>
    )
}