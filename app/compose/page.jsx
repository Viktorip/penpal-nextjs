'use client'
import PageContainer from "@/components/PageContainer";
import { sendLetter } from "../actions";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useValidate from "@/hooks/useValidate";
import { AuthContext } from "../layout";
import Modal from "@/components/Modal";
import { getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import t from "@/lib/localization";


const styleIds = getAllStyleIds();

export default function ComposePage() {
    const {user, setUser} = useContext(AuthContext);
    const [body, setBody] = useState('');
    const [recipient, setRecipient] = useState('');
    const [title, setTitle] = useState('');
    const [closed, setClosed] = useState(false);
    const bodyRef = useRef();
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [titleIsValid, titleError] = useValidate(title, { type: 'text' });
    const [recipientIsValid, recipientError] = useValidate(recipient, { type: 'email' });
    const [selectedStyle, setSelectedStyle] = useState(styleIds[0]);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const formHandler = async () => {
        const formData = new FormData();
        //validate data first??
        formData.append("body", body);
        formData.append("title", title);
        formData.append("recipientEmail", recipient);
        formData.append("senderId", user.id);
        formData.append("style", selectedStyle);
        setSending(true);
        const resp = await sendLetter(formData);
        if (resp) {
            router.push('/success');
            return;
        }

        setSending(false);
    }

    const letterBodyHandler = () => {
        try {
            while (bodyRef.current.clientHeight < bodyRef.current.scrollHeight) {
                let halved = Math.ceil(Math.abs((bodyRef.current.value.length - body.length) / 10));
                if (halved < 1) halved = 1;

                bodyRef.current.value = bodyRef.current.value.substr(0, bodyRef.current.value.length - halved);
            }
        } catch (error) {
            console.log("caught error:", error);
        } finally {
            //set cursor to the end
            bodyRef.current.selectionStart = bodyRef.current.selectionEnd = bodyRef.current.value.length;
            bodyRef.current.focus();

            setBody(bodyRef.current.value);
        }

    }

    const fontChangeHandler = (e) => {
        if (body.length > 0) {
            letterBodyHandler();
            setShowWarningModal(true);
        }else{
            setSelectedStyle(e.target.value);
        }
    }

    return (
        <PageContainer>
            {showWarningModal && <Modal />}
            <form action={formHandler} className="space-y-3">
                <div>
                    <div className='text-xl'>
                        {t('compose_title')}
                    </div>
                    <div>
                        {closed ? (
                            <div>
                                <div>
                                    <label
                                        className="mb-3 mt-5 block text-s font-medium text-gray-900"
                                        htmlFor="title"
                                    >
                                        {t('compose_title_title')}
                                    </label>
                                    <div>
                                        <input
                                            className="w-80 focus:outline-none focus:ring focus:border-blue-500"
                                            id="title"
                                            type="text"
                                            name="title"
                                            placeholder={t('compose_title_title_placeholder')}
                                            required
                                            value={title}
                                            onChange={(e) => { setTitle(e.target.value) }}
                                        />
                                    </div>
                                    <div className="text-red-700">{title.length < 2 || titleIsValid ? '' : titleError.message}</div>
                                </div>
                                <div>
                                    <label
                                        className="mb-3 mt-5 block text-s font-medium text-gray-900"
                                        htmlFor="email"
                                    >
                                        {t('compose_recipient')}
                                    </label>
                                    <div>
                                        <input
                                            className="w-80 focus:outline-none focus:ring focus:border-blue-500"
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder={t('compose_recipient_placeholder')}
                                            required
                                            value={recipient}
                                            onChange={(e) => { setRecipient(e.target.value) }}
                                        />
                                    </div>
                                    <div className="text-red-700">{recipient.length < 2 || recipientIsValid ? '' : recipientError.message}</div>
                                </div>
                                <button className="border-solid hover:bg-blue-400 border-2 border-indigo-700 p-1 rounded-md w-32 bg-white text-blue-700 text-center mt-2" disabled={sending}>{t('compose_send_btn')}</button>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <select onChange={(e)=>{fontChangeHandler(e)}}>
                                    {styleIds.map(item => (<option value={item} className={getClassNameFromStyleId(item)} key={item}>{t('compose_style_example')}</option>))}
                                </select>
                                <div className="h-full w-full ">
                                    <textarea
                                        className={`w-[38rem] p-2 resize-none overflow-hidden focus:outline-none text-2xl ${getClassNameFromStyleId(selectedStyle)} bg-[url('/custom_letter_paper.png')] bg-contain bg-no-repeat placeholder:text-blue-700`}
                                        id="body"
                                        name="body"
                                        placeholder={t('compose_body_placeholder')}
                                        required
                                        rows="22"
                                        maxLength={2000}
                                        minLength={3}
                                        value={body}
                                        onChange={letterBodyHandler}
                                        ref={bodyRef}
                                    >
                                    </textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-solid hover:bg-blue-400 border-2 border-indigo-700 p-1 rounded-md w-32 bg-white text-blue-700 text-center mt-2 cursor-pointer" onClick={() => { if (!sending) setClosed(!closed) }}>{closed ? t('compose_open_letter') : t('compose_close_letter')}</div>
                </div>
            </form>
        </PageContainer>
    )
}