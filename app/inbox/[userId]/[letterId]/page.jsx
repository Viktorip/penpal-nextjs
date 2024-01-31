'use client'
import { AuthContext, LocalizationContext } from "@/app/layout";
import Letter from "@/components/Letter";
import PageContainer from "@/components/PageContainer";
import useFetch from "@/hooks/useFetch";
import t from "@/lib/localization";
import { PAGE_BREAK_ID, endpoint } from "@/utils/constants";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { LuMailQuestion } from "react-icons/lu";



export default function LetterPage() {
    const { loc, setLoc } = useContext(LocalizationContext);
    const { user, setUser } = useContext(AuthContext);
    const params = useParams();
    const router = useRouter();

    const [letter, loading, error] = useFetch(`${endpoint}/letters/${params.letterId}`);

    const [senderData, senderLoading, senderError] = useFetch(`${endpoint}/users/${params.userId}`);

    const [showInfo, setShowInfo] = useState(false);
    const [dateSent, setDateSent] = useState();

    const [letterPages, setLetterPages] = useState(['']);

    useEffect(() => {
        if (letter.success) {
            const date = new Date(letter.data.timestamp);
            const day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
            const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            const formated = "" + day + "." + month + "." + date.getUTCFullYear();
            setDateSent(formated);
            splitLetter(letter.data.body);
        }
    }, [letter]);

    const splitLetter = (body) => {
        const arr = body.split(PAGE_BREAK_ID);
        setLetterPages(arr);
    }

    const handleBack = () => {
        router.push('/inbox');
    }
    const handleShowUserInfo = () => {
        setShowInfo(!showInfo);
    }

    return (
        <PageContainer>
            <div className="flex flex-col items-center space-y-2 h-full relative">
                {!user?.verified &&
                    <div className="self-center border-2 border-black rounded-md bg-red-800 p-6 mb-6 text-center text-white sm:w-[30rem] max-sm:w-[24rem]">
                        <p className="text-white text-xs">
                            {t('verify_email_warning2', loc)}
                        </p>
                    </div>
                }
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row hover:bg-gray-200 hover:ring cursor-pointer text-indigo-900" onClick={handleBack}>
                        <IoChevronBack className="text-xl" />
                        <div className="text-sm">{t('back_to_inbox', loc)}</div>
                    </div>
                    <div className="flex flex-row text-indigo-900 space-x-1 hover:bg-gray-200 hover:ring cursor-pointer" onClick={handleShowUserInfo}>
                        <LuMailQuestion className="text-xl" />
                        <div className="text-sm">{showInfo ? t('hide_sender_info', loc) : t('show_sender_info', loc)}</div>
                    </div>
                </div>
                <div className={`absolute top-[20px] right-0 flex flex-col bg-orange-200 border-2 border-solid rounded-md border-indigo-900 p-2 text-sm text-indigo-900 transition-opacity ease-in duration-700 opacity-0 ${showInfo ? 'opacity-100' : ''}`}>
                    <div>{t('from', loc)}: <span className="text-red-900">{senderData?.data?.fullname}</span></div>
                    <div>{t('login_email', loc)}: <span className="text-red-900">{senderData?.data?.email}</span></div>
                    <div>{t('date', loc)}: <span className="text-red-900">{dateSent}</span></div>
                </div>
                {letterPages?.map((item, id)=>(<Letter
                    startingValue={loading ? t('loading', loc) : letter?.error ? t('something_went_wrong', loc) : item}
                    style={letter?.data?.style ? getClassNameFromStyleId(letter?.data?.style) : getClassNameFromStyleId(getAllStyleIds()[0])}
                    key={id}
                    readOnly
                    className={loading ? 'animate-pulse' : ''}
                />))}
                

            </div>

        </PageContainer>
    );
}

/*
<Letter
                    style={letter?.data?.style ? getClassNameFromStyleId(letter?.data?.style) : getClassNameFromStyleId(getAllStyleIds()[0])}
                    value={loading ? t('loading', loc) : letter?.error ? t('something_went_wrong', loc) : letter?.data?.body}
                    readOnly={true}
                    className={loading ? 'animate-pulse' : ''}
                />
                */