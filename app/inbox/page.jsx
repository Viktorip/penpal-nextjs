'use client'
import PageContainer from "@/components/PageContainer";

import { useContext } from "react";
import { AuthContext } from "../layout";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import Link from "next/link";
import { GiLoveLetter } from "react-icons/gi";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import t from "@/lib/localization";
import Envelope from "@/components/Envelope";


export default function InboxPage() {
    const { user, setUser } = useContext(AuthContext);
    const [data, loading, error] = useFetch(`${endpoint}/users/${user.id}/letters`); // { cache: 'no-store' }

    console.log("Inbox letters:", data.letters);
    if (loading) return (
        <PageContainer>
            {t('loading')}
        </PageContainer>
    );

    if (error) return (
        <PageContainer>
            {error}
        </PageContainer>
    );

    if (data?.letters?.length) return (
        <PageContainer>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {data.letters.map(item => (
                    <div className="w-[30rem] h-[18rem]" key={item.id}>
                        <Link href={`inbox/${item.sender_id}/${item.id}`} >
                            <Envelope
                                optionalSender={item.optional_sender}
                                optionalRecipient={item.optional_recipient}
                                style={getClassNameFromStyleId(item.style)}
                                stamp={item.stamp}
                                readOnly
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </PageContainer>
    );

    return (
        <PageContainer>
            {t('inbox_empty')}
        </PageContainer>
    );
}

const LetterContainer = (props) => {

    return (
        <div className="flex flex-row bg-white border-2 border-blue-300 rounded-lg p-4 space-x-4 items-center w-[42rem]">
            <GiLoveLetter className="text-yellow-700 text-6xl" />
            <Link className={`text-blue-600 text-4xl ${props.style ? getClassNameFromStyleId(props.style) : getClassNameFromStyleId(getAllStyleIds()[0])}`} href={`inbox/${props.userId}/${props.letterId}`}>No title anymore</Link>
        </div>
    )
}