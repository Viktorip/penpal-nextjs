'use client'
import PageContainer from "@/components/PageContainer";

import { useContext } from "react";
import { AuthContext } from "../layout";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import Link from "next/link";
import { GiLoveLetter } from "react-icons/gi";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";


export default function InboxPage() {
    const { user, setUser } = useContext(AuthContext);
    const [data, loading, error] = useFetch(`${endpoint}/users/${user.id}/letters`); // { cache: 'no-store' }

    console.log("Inbox letters:", data.letters);
    if (loading) return (
        <PageContainer>
            Loading letters ...
        </PageContainer>
    );

    if (error) return (
        <PageContainer>
            Error: {error}
        </PageContainer>
    );

    if (data?.letters?.length) return (
        <PageContainer>
            <div className="space-y-4">
                {data.letters.map(item => (<LetterContainer key={item.id} userId={item.sender_id} title={item.title} letterId={item.id} style={item.style} />))}
            </div>
        </PageContainer>
    );

    return (
        <PageContainer>
            No letters found
        </PageContainer>
    );
}

const LetterContainer = (props) => {

    return (
        <div className="flex flex-row bg-white border-2 border-blue-300 rounded-lg p-4 space-x-4 items-center w-[42rem]">
            <GiLoveLetter className="text-yellow-700 text-6xl" />
            <Link className={`text-blue-600 text-4xl ${props.style ? getClassNameFromStyleId(props.style) : getClassNameFromStyleId(getAllStyleIds()[0])}`} href={`inbox/${props.userId}/${props.letterId}`}>{props.title}</Link>
        </div>
    )
}