'use client'
import Letter from "@/components/Letter";
import PageContainer from "@/components/PageContainer";
import useFetch from "@/hooks/useFetch";
import t from "@/lib/localization";
import { endpoint } from "@/utils/constants";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { TbUserQuestion } from "react-icons/tb";



export default function LetterPage() {
    const params = useParams();
    const router = useRouter();
    const [data, loading, error] = useFetch(`${endpoint}/letters/${params.letterId}`);
    const date = new Date(1702388316.72 * 1000);
    console.log("date:", date);
    const utc = date.toUTCString();

    console.log("inside letter page data:", data);
    const [senderData, senderLoading, senderError] = useFetch(`${endpoint}/users/${params.userId}`);

    const [showInfo, setShowInfo] = useState(false);
    const [dateSent, setDateSent] = useState();

    useEffect(() => {
        if (data.letter) {
            const date = new Date(data.letter.timestamp * 1000);
            //const utc = date.toUTCString();
            const day = date.getUTCDay() < 10 ? "0"+date.getUTCDay() : date.getUTCDay();
            const month = (date.getMonth() + 1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth() + 1);
            const formated ="" + day + "." + month + "." + date.getUTCFullYear();
            setDateSent(formated);
        }
    }, [data])

    const handleBack = () => {
        router.push('/inbox');
    }
    const handleShowUserInfo = () => {
        setShowInfo(!showInfo);
    }

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
                <div className="flex flex-row space-x-4">
                    <div className="hover:bg-blue-200 hover:cursor-pointer" onClick={handleBack}>
                        <IoArrowBackCircleOutline className="text-5xl text-blue-400 bg-white rounded-full" />
                    </div>
                    <div className="hover:bg-blue-200 hover:cursor-pointer" onClick={handleShowUserInfo}>
                        <TbUserQuestion className="text-5xl text-blue-400 bg-white rounded-2xl" />
                    </div>

                    <div className={`flex flex-col transition-opacity ease-in duration-700 opacity-0 ${showInfo ? 'opacity-100' : ''}`}>
                        <div>From: {senderData?.user?.email}</div>
                        <div>Date: {dateSent}</div>
                    </div>
                </div>
                <Letter
                    style={data.letter.style ? getClassNameFromStyleId(data.letter.style) : getClassNameFromStyleId(getAllStyleIds()[0])}
                    value={data.letter.body}
                    readOnly={true}
                />

            </div>

        </PageContainer>
    );

    return (
        <PageContainer>
            <div>{t('not_found')}</div>
        </PageContainer>
    )
}

/*

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

*/