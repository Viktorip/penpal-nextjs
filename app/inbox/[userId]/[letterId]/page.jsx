'use client'
import { LocalizationContext } from "@/app/layout";
import Letter from "@/components/Letter";
import PageContainer from "@/components/PageContainer";
import useFetch from "@/hooks/useFetch";
import t from "@/lib/localization";
import { endpoint } from "@/utils/constants";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { LuMailQuestion } from "react-icons/lu";



export default function LetterPage() {
    const { loc, setLoc } = useContext(LocalizationContext);
    const params = useParams();
    const router = useRouter();
    const [data, loading, error] = useFetch(`${endpoint}/letters/${params.letterId}`);

    const [senderData, senderLoading, senderError] = useFetch(`${endpoint}/users/${params.userId}`);

    const [showInfo, setShowInfo] = useState(false);
    const [dateSent, setDateSent] = useState();

    useEffect(() => {
        if (data.letter) {
            const date = new Date(data.letter.timestamp);
            //const utc = date.toUTCString();
            const day = date.getUTCDate() < 10 ? "0" + date.getUTCDay() : date.getUTCDate();
            const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            const formated = "" + day + "." + month + "." + date.getUTCFullYear();
            setDateSent(formated);
        }
    }, [data])

    const handleBack = () => {
        router.push('/inbox');
    }
    const handleShowUserInfo = () => {
        setShowInfo(!showInfo);
    }

    return (
        <PageContainer>
            <div className="flex flex-col items-center space-y-2 h-full relative">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row hover:bg-gray-200 hover:ring cursor-pointer text-indigo-900" onClick={handleBack}>
                        <IoChevronBack className="text-xl" />
                        <div className="text-sm">{t('back_to_inbox',loc)}</div>
                    </div>
                    <div className="flex flex-row text-indigo-900 space-x-1 hover:bg-gray-200 hover:ring cursor-pointer" onClick={handleShowUserInfo}>
                        <LuMailQuestion className="text-xl" />
                        <div className="text-sm">{showInfo ? t('hide_sender_info', loc) : t('show_sender_info',loc)}</div>
                    </div>
                </div>
                <div className={`absolute top-[20px] right-0 flex flex-col bg-orange-200 border-2 border-solid rounded-md border-indigo-900 p-2 text-sm text-indigo-900 transition-opacity ease-in duration-700 opacity-0 ${showInfo ? 'opacity-100' : ''}`}>
                    <div>{t('from',loc)}: <span className="text-red-900">{senderData?.user?.email}</span></div>
                    <div>{t('date',loc)}: <span className="text-red-900">{dateSent}</span></div>
                </div>
                <Letter
                    style={data?.letter?.style ? getClassNameFromStyleId(data?.letter?.style) : getClassNameFromStyleId(getAllStyleIds()[0])}
                    value={loading ? t('loading',loc) : error ? t('something_went_wrong',loc) : data?.letter?.body}
                    readOnly={true}
                    className={loading ? 'animate-pulse' : ''}
                />

            </div>

        </PageContainer>
    );
}