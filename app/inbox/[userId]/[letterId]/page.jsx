'use client'
import PageContainer from "@/components/PageContainer";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/utils/constants";
import { useParams } from "next/navigation";



export default function LetterPage() {
    const params = useParams();
    console.log("params are:", params);
    const [data, loading, error] = useFetch(`${endpoint}/letters/${params.letterId}`);
    console.log("have data:", data);
    const [senderData, senderLoading, senderError] = useFetch(`${endpoint}/users/${params.userId}`);
    console.log("have senderData:", senderData);

    if (loading) return (
        <PageContainer>
            Loading letter ...
        </PageContainer>
    );

    if (error) return (
        <PageContainer>
            Error: {error}
        </PageContainer>
    );

    if (data?.letter?.id) return (
        <PageContainer>
            <div className="flex-row space-y-2 h-full w-full">
                <div>
                    {`From: ${senderData?.user?.email}`}
                </div>
                <div className="h-full w-full ">
                    <textarea
                        className="w-full h-full bg-yellow-100 p-2 resize-none overflow-hidden border-solid border border-amber-800 focus:outline-none focus:ring focus:border-blue-500 text-2xl"
                        id="body"
                        name="body"
                        rows="22"
                        value={data.letter.body}
                        readOnly
                    >
                    </textarea>
                </div>

            </div>

        </PageContainer>
    );

    return (
        <PageContainer>
            <div>Something went wrong</div>
        </PageContainer>
    )
}