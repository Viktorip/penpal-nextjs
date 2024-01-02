'use client'
import PageContainer from "@/components/PageContainer";
import { sendLetter } from "../actions";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useValidate from "@/hooks/useValidate";
import { AuthContext } from "../layout";
import Modal from "@/components/Modal";
import { getAllStamps, getAllStyleIds, getClassNameFromStyleId } from "@/utils/helper";
import t from "@/lib/localization";
import Letter from "@/components/Letter";
import StampSelectionModal from "@/components/StampSelectionModal";
import Envelope from "@/components/Envelope";
import SendModal from "@/components/SendModal";
import { GiWaxSeal } from "react-icons/gi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { TbHexagonNumber1, TbHexagonNumber2, TbHexagonNumber3 } from "react-icons/tb";
import { BsEnvelopeExclamation } from "react-icons/bs";


const styleIds = getAllStyleIds();
const stamps = getAllStamps();

export default function ComposePage() {
    const { user, setUser } = useContext(AuthContext);
    const [body, setBody] = useState('');
    const [recipient, setRecipient] = useState('');
    const [title, setTitle] = useState('');
    const [closed, setClosed] = useState(false);
    const [sending, setSending] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(styleIds[0]);
    const [showWarningModal, setShowWarningModal] = useState({ show: false, blocked: '' });
    const [optionalRecipient, setOptionalRecipient] = useState('');
    const [optionalSender, setOptionalSender] = useState('');
    const [showStampModal, setShowStampModal] = useState(false);
    const [selectedStamp, setSelectedStamp] = useState('');
    const [showSendModal, setShowSendModal] = useState(false);

    const bodyRef = useRef();
    const styleRef = useRef();
    const optionalRecipientRef = useRef();
    const optionalSenderRef = useRef();

    const router = useRouter();

    /*
    const [titleIsValid, titleError] = useValidate(title, { type: 'text' });
    const [recipientIsValid, recipientError] = useValidate(recipient, { type: 'email' });
    */


    const formHandler = async () => {
        const formData = new FormData();
        //validate data first??
        formData.append("body", body);
        formData.append("recipientEmail", recipient);
        formData.append("senderId", user.id);
        formData.append("style", selectedStyle);
        formData.append("optionalSender", optionalSender);
        formData.append("optionalRecipient", optionalRecipient);
        formData.append("stamp", selectedStamp);

        const resp = await sendLetter(formData);
        if (resp) {
            router.push('/success');
            return;
        }
        console.log("Failed to send the letter");
        setShowSendModal(false);
        setSending(false);
    }

    const textareaHandler = (targetRef, cb, small = false) => {
        //let changed = false;
        try {
            while (targetRef.current.clientHeight < targetRef.current.scrollHeight) {
                let halved = Math.ceil(Math.abs((targetRef.current.value.length - body.length) / 10));
                if (halved < 1) halved = 1;
                if (small) halved = 1;

                targetRef.current.value = targetRef.current.value.substr(0, targetRef.current.value.length - halved);
                //if (!changed) changed = true;
            }
        } catch (error) {
            console.log("caught error:", error);
        } finally {
            /*
            //this seems to do nothing?
            if (changed) {
                //set cursor to the end
                targetRef.current.selectionStart = targetRef.current.selectionEnd = targetRef.current.value.length;
                targetRef.current.focus();
            }
            */

            cb(targetRef.current.value);
        }
    }

    const fontChangeHandler = (e) => {
        if (body.length > 0) {
            textareaHandler(bodyRef, (val) => setBody(val));
            setShowWarningModal({ show: true, blocked: e.target.value });
        } else {
            setSelectedStyle(e.target.value);
        }
    }

    const handleModalContinue = () => {
        setSelectedStyle(showWarningModal.blocked);
        setShowWarningModal({ show: false, blocked: '' });
    }

    const handleModalCancel = () => {
        setShowWarningModal({ show: false, blocked: '' });
        styleRef.current.value = selectedStyle;
    }

    const handleStampSelection = (path) => {
        if (path === stamps[0]) {
            setSelectedStamp(null);
        } else {
            setSelectedStamp(path);
        }

        setShowStampModal(false);
        console.log("selected stamp:", path);
    }

    return (
        <PageContainer className="relative">
            {showWarningModal.show &&
                <Modal
                    okCallback={handleModalContinue}
                    cancelCallback={handleModalCancel}
                    type='warning'
                    title={t('modal_changestyle_title')}
                    body={t('modal_changestyle_body')}
                    okString={t('modal_changestyle_ok')}
                    cancelString={t('modal_default_cancel')}
                />
            }
            {showStampModal &&
                <StampSelectionModal
                    cancelCallback={() => setShowStampModal(false)}
                    type='custom'
                    title={t('choose_stamp_title')}
                    body={t('choose_stamp_body')}
                    okString={t('modal_default_ok')}
                    cancelString={t('modal_default_cancel')}
                    stamps={stamps}
                    stampCallback={handleStampSelection}
                />
            }
            {showSendModal &&
                <SendModal
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    formAction={() => {
                        setSending(true);
                        formHandler();
                    }}
                    cancelCallback={() => { setShowSendModal(false); }}
                    okString={t('send')}
                    cancelString={t('modal_default_cancel')}
                    title={t('compose_send_modal_title')}
                    body={t('compose_send_modal_body')}
                    sending={sending}
                />
            }
            <div className="space-y-3">
                <div>
                    {closed ? (
                        //Closed letter
                        <div>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row space-x-2 cursor-pointer text-center mb-1 hover:bg-gray-200 hover:ring" onClick={() => setClosed(false)}>
                                    <GiWaxSeal className="text-red-900 text-2xl" />
                                    <div className="text-indigo-900">{t('compose_open_letter')}</div>
                                </div>
                                <div className="flex flex-row cursor-pointer mb-1 text-indigo-900 hover:ring hover:bg-gray-200" onClick={() => setShowSendModal(true)}>
                                    <div><BsEnvelopeExclamation className="text-2xl animate-bounce" /></div>
                                    <div>{t('continue')}</div>
                                    </div>
                            </div>
                            <div className="relative">
                                <Envelope
                                    style={getClassNameFromStyleId(selectedStyle)}
                                    optionalRecipientRef={optionalRecipientRef}
                                    optionalRecipient={optionalRecipient}
                                    onChangeRecipient={() => textareaHandler(optionalRecipientRef, setOptionalRecipient, true)}
                                    optionalSenderRef={optionalSenderRef}
                                    optionalSender={optionalSender}
                                    onChangeSender={() => textareaHandler(optionalSenderRef, setOptionalSender, true)}
                                    onClickStamp={() => setShowStampModal(true)}
                                    stamp={selectedStamp}
                                />
                                <HelperArrow body={t('envelope_helper_fill')} animate="animate-bounce-x" index={1} />
                            </div>

                            <div className="my-2 text-xl text-indigo-900">{t('compose_preview')}</div>
                            <div className="relative">
                                <Envelope
                                    optionalSender={optionalSender}
                                    optionalRecipient={optionalRecipient}
                                    style={getClassNameFromStyleId(selectedStyle)}
                                    stamp={selectedStamp}
                                    readOnly
                                />
                                <HelperArrow body={t('envelope_helper_preview')} animate="animate-bounce-x-slow" index={2} />
                            </div>
                        </div>
                    ) : (
                        //Open letter
                        <div>
                            <div className="mt-4">
                                <div className="flex flex-row justify-between items-center">
                                    <div>
                                        <select ref={styleRef} onChange={(e) => { fontChangeHandler(e) }}>
                                            {styleIds.map(item => (<option value={item} className={getClassNameFromStyleId(item)} key={item}>{t('compose_style_example')}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex flex-row space-x-2 cursor-pointer text-center mb-1 hover:bg-gray-200 hover:ring" onClick={() => setClosed(true)}>
                                        <GiWaxSeal className="text-red-900 text-2xl" />
                                        <div className="text-indigo-900">{t('compose_close_letter')}</div>
                                    </div>
                                </div>
                                <Letter
                                    style={getClassNameFromStyleId(selectedStyle)}
                                    placeholder={t('compose_body_placeholder')}
                                    value={body}
                                    onChange={() => textareaHandler(bodyRef, setBody)}
                                    taRef={bodyRef}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}

const HelperArrow = (props) => {

    return (
        <div className="absolute top-1/2 -right-[140px] text-red-700">
            <div className={`flex flex-row w-26 h-12 ${props.animate}`}>
                <div className="w-8 h-8">
                    <BiSolidLeftArrow className="text-5xl" />
                </div>
                <div className="w-8 h-10 -ml-4 mt-3">
                    {props.index === 1 &&
                        <TbHexagonNumber1 className="text-2xl text-white" />
                    }
                    {props.index === 2 &&
                        <TbHexagonNumber2 className="text-2xl text-white" />
                    }
                    {props.index === 3 &&
                        <TbHexagonNumber3 className="text-2xl text-white" />
                    }
                </div>
                <div className="text-[13px] w-20 h-10 self-center">
                    {props.body}
                </div>
            </div>

        </div>
    )
}