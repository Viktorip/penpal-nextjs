'use client'
import PageContainer from "@/components/PageContainer";
import { doesUserExist, sendLetter } from "../actions";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, LocalizationContext } from "../layout";
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
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import useFetch from "@/hooks/useFetch";
import { PAGE_BREAK_ID, endpoint } from "@/utils/constants";
import Drawing from "@/components/Drawing";
import lzString from "lz-string";
import { FcPicture } from "react-icons/fc";


const styleIds = getAllStyleIds();
const stamps = getAllStamps();

export default function ComposePage() {
    const { user, setUser } = useContext(AuthContext);
    const { loc, setLoc } = useContext(LocalizationContext);
    const [body, setBody] = useState(['']);
    const [recipient, setRecipient] = useState('');
    const [closed, setClosed] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(styleIds[0]);
    const [showWarningModal, setShowWarningModal] = useState({ show: false, blocked: '' });
    const [optionalRecipient, setOptionalRecipient] = useState('');
    const [optionalSender, setOptionalSender] = useState('');
    const [showStampModal, setShowStampModal] = useState(false);
    const [selectedStamp, setSelectedStamp] = useState('');
    const [showSendModal, setShowSendModal] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [sending, setSending] = useState(false);
    const [submitError, setSubmitError] = useState();
    const [drawingData, setDrawingData] = useState('');
    const [showDrawing, setShowDrawing] = useState(false);

    const styleRef = useRef();
    const optionalRecipientRef = useRef();
    const optionalSenderRef = useRef();

    const router = useRouter();

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [addressbook, addressbookLoading, addressbookError] = useFetch(`${endpoint}/users/${user._id}/addressbook`);

    useEffect(() => {
        //I dont know why I need to do this shit like this
        if (sending) {
            submitForm();
        }
    }, [sending]);



    const formHandler = () => {
        setSending(true);
    }

    const submitForm = async () => {
        //first check if recipient exists, maybe removed once invite feature is implemented

        if (!sending) return;
        try {
            const findUser = await doesUserExist(recipient);
            if (!findUser.success) {
                console.log(findUser.error);
                setSubmitError(findUser.status);
                setSending(false);
                return;
            }
        } catch (error) {
            setSending(false);
            console.log("System error finding user.");
            return;
        }

        if (!executeRecaptcha) {
            setSending(false);
            return;
        }

        //clown check
        if (body.length > 5) {
            setSending(false);
            console.log("Too many pages in letter, cant send");
            return;
        }

        const formData = new FormData();
        //data is validated on the backend       
        formData.append("body", body.join(PAGE_BREAK_ID));
        formData.append("recipientEmail", recipient);
        formData.append("senderId", user._id);
        formData.append("style", selectedStyle);
        formData.append("optionalSender", optionalSender);
        formData.append("optionalRecipient", optionalRecipient);
        formData.append("stamp", selectedStamp);

        const dd = drawingData.length ? JSON.parse(drawingData) : null;
        if (dd?.lines.length && showDrawing) {
            const compressed = lzString.compressToEncodedURIComponent(drawingData);
            formData.append("drawing", compressed);
        }

        try {
            const token = await executeRecaptcha();

            if (!token) {
                console.log("Failed to get token");
                return;
            }
            formData.append("token", token);

            const resp = await sendLetter(formData);

            if (resp.success) {
                router.push('/success');
            } else {
                console.log(resp.error);
                router.push('/error');
            }
        } catch (error) {
            console.log(error);
            setSending(false);
            return;
        }
    }

    const letterBodyHandler = (val, id, pagebreakVal) => {
        const arr = [...body];
        arr[id] = val;
        if (id !== 0 && val.trim() === '') {
            arr.splice(id, 1);
        }
        if (pagebreakVal) {
            if (arr[id + 1] === undefined && arr.length < 5) {
                arr.push(pagebreakVal.trim());
            }
        }
        if (arr[0]?.trim()?.length && validationError) setValidationError(false);
        setBody(arr);
    }

    const textareaHandler = (targetRef, cb = () => { }, small = false) => {
        try {
            while (targetRef.current.clientHeight < targetRef.current.scrollHeight) { //+2 because of font #2 not being able to go last line
                let halved = Math.ceil(Math.abs((targetRef.current.value.length - body.length) / 10));
                if (halved < 1) halved = 1;
                if (small) halved = 1;

                targetRef.current.value = targetRef.current.value.substr(0, targetRef.current.value.length - halved);
            }
        } catch (error) {
            console.log("caught error:", error);
        } finally {
            cb(targetRef.current.value);
        }
    }

    const fontChangeHandler = (e) => {
        if (body.length > 0) {
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
    }

    const handleAddressbookClick = (address) => {
        setRecipient(address);
    }

    const handleDrawingUnmount = (data) => {
        setDrawingData(data);
    }

    return (
        <PageContainer className="relative">
            {showWarningModal.show &&
                <Modal
                    okCallback={handleModalContinue}
                    cancelCallback={handleModalCancel}
                    type='warning'
                    title={t('modal_changestyle_title', loc)}
                    body={t('modal_changestyle_body', loc)}
                    okString={t('modal_changestyle_ok', loc)}
                    cancelString={t('modal_default_cancel', loc)}
                />
            }
            {showStampModal &&
                <StampSelectionModal
                    cancelCallback={() => setShowStampModal(false)}
                    type='custom'
                    title={t('choose_stamp_title', loc)}
                    body={t('choose_stamp_body', loc)}
                    okString={t('modal_default_ok', loc)}
                    cancelString={t('modal_default_cancel', loc)}
                    stamps={stamps}
                    stampCallback={handleStampSelection}
                />
            }
            {showSendModal &&
                <SendModal
                    value={recipient}
                    onChange={(e) => {
                        setRecipient(e.target.value);
                        setSubmitError(null);
                    }}
                    formAction={formHandler}
                    cancelCallback={() => { setShowSendModal(false); }}
                    okString={t('send', loc)}
                    cancelString={t('modal_default_cancel', loc)}
                    title={t('compose_send_modal_title', loc)}
                    body={t('compose_send_modal_body', loc)}
                    sending={sending}
                    error={submitError}
                    addressbookList={addressbook?.data}
                    handleAddressbookClick={handleAddressbookClick}
                />
            }
            <div className="space-y-3">
                <div className="flex flex-col">
                    {!user?.verified &&
                        <div className="self-center border-2 border-black rounded-md bg-red-800 p-6 mb-6 text-center text-white sm:w-[30rem] max-sm:w-[22.5rem]">
                            <p className="text-white text-xs">
                                {t('verify_email_warning', loc)}
                            </p>
                        </div>
                    }

                    {closed ? (
                        //Closed letter
                        <div>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row space-x-2 cursor-pointer text-center mb-1 hover:bg-gray-200 hover:ring" onClick={() => setClosed(false)}>
                                    <GiWaxSeal className="text-red-900 text-2xl" />
                                    <div className="text-indigo-900">{t('compose_open_letter', loc)}</div>
                                </div>
                                <div className="flex flex-row cursor-pointer mb-1 text-indigo-900 hover:ring hover:bg-gray-200" onClick={() => setShowSendModal(true)}>
                                    <div><BsEnvelopeExclamation className="text-2xl animate-bounce" /></div>
                                    <div>{t('continue', loc)}</div>
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
                                <div className="max-sm:hidden">
                                    <HelperArrow body={t('envelope_helper_fill', loc)} animate="animate-bounce-x" index={1} />
                                </div>
                            </div>

                            <div className="my-2 text-xl text-indigo-900">{t('compose_preview', loc)}</div>
                            <div className="relative">
                                <Envelope
                                    optionalSender={optionalSender}
                                    optionalRecipient={optionalRecipient}
                                    style={getClassNameFromStyleId(selectedStyle)}
                                    stamp={selectedStamp}
                                    readOnly
                                />
                                <div className="max-sm:hidden">
                                    <HelperArrow body={t('envelope_helper_preview', loc)} animate="animate-bounce-x-slow" index={2} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        //Open letter
                        <div>
                            <div className="mt-4">
                                <div className="relative flex flex-row items-center justify-between">
                                    <div className="max-sm:text-sm sm:text-md">
                                        <select ref={styleRef} onChange={(e) => { fontChangeHandler(e) }}>
                                            {styleIds.map(item => (<option value={item} className={getClassNameFromStyleId(item)} key={item}>{t('compose_style_example', loc)}</option>))}
                                        </select>
                                    </div>
                                    {validationError && <div className="absolute -top-6 right-0 text-xs text-red-500 animate-pulse">{t('error_body_empty', loc)}</div>}
                                    <div className="flex flex-row space-x-2 cursor-pointer text-center mb-1 hover:bg-gray-200 hover:ring" onClick={() => {
                                        if (!body[0]?.trim()?.length) {
                                            setValidationError(true);
                                        } else {
                                            setClosed(true);
                                        }
                                    }}>
                                        <GiWaxSeal className="text-red-900 max-sm:text-lg sm:text-2xl" />
                                        <div className="max-sm:text-sm sm:text-md text-indigo-900">{t('compose_close_letter', loc)}</div>
                                    </div>
                                </div>

                                {body.map((item, id) => (
                                    <Letter
                                        style={getClassNameFromStyleId(selectedStyle)}
                                        callback={(val, pagebreakVal) => {
                                            letterBodyHandler(val, id, pagebreakVal);
                                        }}
                                        key={id}
                                        startingValue={item}
                                        className='mb-4'
                                    />))
                                }
                                <div className="flex flex-row justify-center items-center space-x-1 mb-4 text-sm text-indigo-900 hover:ring hover:bg-gray-200 cursor-pointer" onClick={() => 
                                    {
                                        setShowDrawing(!showDrawing);
                                }}>
                                    <FcPicture className="text-2xl" />
                                    <div>{showDrawing ? t('remove_drawing', loc) : t('add_drawing', loc)}</div>
                                </div>
                                {showDrawing &&
                                    <Drawing
                                        options={{
                                            lazyRadius: 0,
                                            saveData: drawingData,
                                            immediateLoading: true
                                        }}
                                        unmountCallback={handleDrawingUnmount}
                                        data={drawingData}
                                        className="mb-6"
                                        noDraw={true}
                                    />
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}

/*
<Letter
                                    style={getClassNameFromStyleId(selectedStyle)}
                                    placeholder={t('compose_body_placeholder', loc)}
                                    value={body}
                                    onChange={() => textareaHandler(bodyRef, setBody)}
                                    taRef={bodyRef}
                                />
                                */

const HelperArrow = (props) => {

    return (
        <div className="absolute max-sm:top-1/3 max-sm:right-0 sm:top-1/2 sm:-right-[140px] text-indigo-900">
            <div className={`flex flex-row w-26 h-12 ${props.animate}`}>
                <div className="w-8 h-8">
                    <BiSolidLeftArrow className="text-5xl" />
                </div>
                <div className="w-8 h-10 -ml-4 mt-3 ">
                    {props.index === 1 &&
                        <TbHexagonNumber1 className="text-2xl text-gray-200" />
                    }
                    {props.index === 2 &&
                        <TbHexagonNumber2 className="text-2xl text-gray-200" />
                    }
                    {props.index === 3 &&
                        <TbHexagonNumber3 className="text-2xl text-gray-200" />
                    }
                </div>
                <div className="text-[13px] w-20 h-10 -ml-2.5 pl-1 self-center  bg-gradient-to-r from-sky-500 to-indigo-100">
                    {props.body}
                </div>
            </div>

        </div>
    )
}