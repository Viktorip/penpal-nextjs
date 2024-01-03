'use client'
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";


export default async function LogoutPage() {

    return (
        <PageContainer>
            <div>{t('logout_success')}</div>
        </PageContainer>
    )
} 