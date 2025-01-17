'use client'
import { AuthContext, LocalizationContext } from "@/app/layout";
import PageContainer from "@/components/PageContainer";
import t from "@/lib/localization";
import { endpoint } from "@/utils/constants";
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react";



export default function VerifyPage() {
    const params = useParams();
    const { user, setUser } = useContext(AuthContext);
    const {loc, setLoc} = useContext(LocalizationContext);

    const [status, setStatus] = useState('waiting');

    const verifyUser = async (userId, verifyId) => {
        if (status === 'loading') {
            return;
        }
        const result = await fetch(`${endpoint}/verify`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ userId, verifyId })
        });
        const data = await result.json();

        if (data?.success) {
            setStatus('complete');
            setUser(data.user);
        }else{
            setStatus('error');
        }
    }

    useEffect(() => {
        if (user?._id && status === 'waiting') {
            setStatus('loading');
            verifyUser(user._id, params.id);
        }
    }, [user]);
    
    return (
        <PageContainer>
            {(status !== 'complete' && status !== 'error') &&
                <div className="animate-pulse">
                    <Spinner title={t('spinner_verifying', loc)} />
                </div>
            }
            {status === 'complete' &&
                <div>{t('verify_email_success', loc)}</div>
            }
            {status === 'error' &&
                <div>{t('something_went_wrong', loc)}</div>
            }
        </PageContainer>
    )
}

const Spinner = ({ title }) => {

    return (
        <div className="flex flex-row">
            <svg className="animate-spin h-5 w-5 mr-3 place-self-center" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {title}
        </div>
    )
}