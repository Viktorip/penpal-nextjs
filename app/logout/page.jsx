import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";


export default async function LogoutPage() {
    const success = true;

    return (
        <PageContainer>
            {success ?
                <div>{t('logout_success')}</div>
                :
                <div>{t('logout_error')}</div>
            }
        </PageContainer>
    )
} 