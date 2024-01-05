'use client'
import PageContainer from "@/components/PageContainer";

import { useContext } from "react";
import { AuthContext, LocalizationContext } from "../layout";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import Link from "next/link";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import t from "@/lib/localization";
import Envelope from "@/components/Envelope";


export default function InboxPage() {
    const { user, setUser } = useContext(AuthContext);
    const { loc, setLoc } = useContext(LocalizationContext);
    const [data, loading, error] = useFetch(`${endpoint}/users/${user.id}/letters`); // { cache: 'no-store' }

    return (
        <PageContainer>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {loading && <div>{t('loading', loc)}</div>}
                {error && <div>{t('inbox_empty', loc)}</div>}
                {data?.letters?.toReversed()?.map(item => (
                    <div className="w-[30rem] h-[18rem]" key={item.id}>
                        <Link href={`inbox/${item.sender_id}/${item.id}`} >
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
                {data?.letters?.length === 0 && <div>{t('inbox_empty', loc)}</div>}
            </div>
        </PageContainer>
    );
}