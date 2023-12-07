'use client'
import PageContainer from "@/components/PageContainer";
import useFetch from "@/hooks/useFetch";
import t from "@/lib/localization";
import { endpoint } from "@/utils/constants";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import { useParams } from "next/navigation";



export default function LetterPage() {
    const params = useParams();
    const [data, loading, error] = useFetch(`${endpoint}/letters/${params.letterId}`);
    const [senderData, senderLoading, senderError] = useFetch(`${endpoint}/users/${params.userId}`);

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

    if (data?.letter?.id) return (
        <PageContainer>
            <div className="flex-row space-y-2 h-full w-full">
                <div>
                    {`From: ${senderData?.user?.email}`}
                </div>
                <div className="h-full w-full ">
                    <textarea
                        className={`w-[38rem] bg-yellow-100 p-2 resize-none overflow-hidden border-solid border border-amber-800 focus:outline-none focus:ring focus:border-blue-500 text-2xl ${data.letter.style ? getClassNameFromStyleId(data.letter.style) : getClassNameFromStyleId(getAllStyleIds()[0])}`}
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
            <div>{t('not_found')}</div>
        </PageContainer>
    )
}