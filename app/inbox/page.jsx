'use client'
import PageContainer from "@/components/PageContainer";

import { useContext } from "react";
import { AuthContext } from "../layout";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import Link from "next/link";


export default function InboxPage() {
    const { user, setUser } = useContext(AuthContext);
    const [data, loading, error] = useFetch(`${endpoint}/users/${user.id}/letters`, { cache: 'no-store' });

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
                {data.letters.map(item => (<LetterContainer key={item.id} userId={item.sender_id} title={item.title} letterId={item.id} />))}
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
        <div>
            <Link href={`inbox/${props.userId}/${props.letterId}`}>{props.title}</Link>
        </div>
    )
}