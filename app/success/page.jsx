'use client'
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";
import { useContext } from "react";
import { LocalizationContext } from "../layout";
//import VerifyEmailTemplate from "@/components/VerifyEmailTemplate";


export default function SuccessPage() {
    const { loc, setLoc } = useContext(LocalizationContext);

    return (
        <PageContainer>
            {t('letter_success_title', loc)}
        </PageContainer>
    )
}

/*

<VerifyEmailTemplate loc='en' fullname='Jaakko Sukunimi' email='posti_paikka@hotmail.com' verifyLink='htttps://kirjekaverit.fi/verify/jekoeskoeskrskorso' />
*/