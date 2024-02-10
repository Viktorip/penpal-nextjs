'use client'
import PageContainer from "@/components/PageContainer";

import { useContext } from "react";
import { AuthContext, LocalizationContext } from "../layout";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import Link from "next/link";
import { getClassNameFromStyleId } from "@/utils/helper";
import t from "@/lib/localization";
import Envelope from "@/components/Envelope";


export default function InboxPage() {
    const { user, setUser } = useContext(AuthContext);
    const { loc, setLoc } = useContext(LocalizationContext);
    const [data, loading, error] = useFetch(`${endpoint}/users/${user._id}/letters`); // { cache: 'no-store' }

    return (
        <PageContainer className="flex-col">
            {!user?.verified &&
                <div className="self-center border-2 border-black rounded-md bg-red-800 p-6 mb-6 text-center text-white sm:w-[30rem] max-sm:w-[22.5rem]">
                    <p className="text-white text-xs">
                        {t('verify_email_warning2', loc)}
                    </p>
                </div>
            }
            <div className="flex sm:flex-row sm:flex-wrap sm:gap-4 sm:justify-center max-sm:flex-col max-sm:items-center max-sm:space-y-4">
                {loading && <div>{t('loading', loc)}</div>}
                {error && <div>{t('inbox_empty', loc)}</div>}
                {data?.data?.toReversed()?.map(item => (
                    <div className="" key={item._id.toString()}>
                        <Link href={`inbox/${item.sender_id}/${item._id.toString()}`} className={`${!user?.verified && 'pointer-events-none'}`} >
                            <Envelope
                                optionalSender={item.optional_sender}
                                optionalRecipient={item.optional_recipient}
                                style={getClassNameFromStyleId(item.style)}
                                stamp={item.stamp}
                                readOnly
                                className="hover:ring-4 hover:ring-blue-500"
                            />
                        </Link>
                    </div>
                ))}
                {data?.data?.length === 0 && <div>{t('inbox_empty', loc)}</div>}
            </div>
        </PageContainer>
    );
}