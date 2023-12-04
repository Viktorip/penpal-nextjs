'use client'
import PageContainer from "@/components/PageContainer";
import { sendLetter } from "../actions";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useValidate from "@/hooks/useValidate";
import { AuthContext } from "../layout";
import { caveat, indieflower, nothing, parisienne, reeniebeanie, tangerine } from "../fonts";
import Modal from "@/components/Modal";

const fontmap = [
    {
        id: 'caveat',
        className: caveat.className
    },
    {
        id: 'indieflower',
        className: indieflower.className
    },
    {
        id: 'nothing',
        className: nothing.className
    },
    {
        id: 'parisienne',
        className: parisienne.className
    },
    {
        id: 'reeniebeanie',
        className: reeniebeanie.className
    },
    {
        id: 'tangerine',
        className: tangerine.className
    },
];

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
    const [selectedFont, setSelectedFont] = useState(fontmap[0].className);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const formHandler = async () => {
        const formData = new FormData();
        //validate data first??
        formData.append("body", body);
        formData.append("title", title);
        formData.append("recipientEmail", recipient);
        formData.append("senderId", user.id);
        setSending(true);
        const resp = await sendLetter(formData);
        console.log("got response from sendLetter", resp);
        if (resp) {
            console.log("Success sending letter");
            router.push('/success');
            return;
        }

        setSending(false);
        console.log("Failed to send???");
    }

    const letterBodyHandler = () => {
        try {
            console.log("try to set content right");
            while (bodyRef.current.clientHeight < bodyRef.current.scrollHeight) {
                let halved = Math.ceil(Math.abs((bodyRef.current.value.length - body.length) / 10));
                console.log("halved is:", halved);
                if (halved < 1) halved = 1;

                bodyRef.current.value = bodyRef.current.value.substr(0, bodyRef.current.value.length - halved);
            }
        } catch (error) {
            console.log("caught error:", error);
        } finally {
            console.log("Finally setBody");
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
            setSelectedFont(fontmap[e.target.value].className);
        }
    }

    return (
        <PageContainer>
            {showWarningModal && <Modal />}
            <form action={formHandler} className="space-y-3">
                <div>
                    <div className='text-xl'>
                        Write from your heart
                    </div>
                    <div>
                        {closed ? (
                            <div>
                                <div>
                                    <label
                                        className="mb-3 mt-5 block text-s font-medium text-gray-900"
                                        htmlFor="title"
                                    >
                                        Title
                                    </label>
                                    <div>
                                        <input
                                            className="w-80 focus:outline-none focus:ring focus:border-blue-500"
                                            id="title"
                                            type="text"
                                            name="title"
                                            placeholder="Enter title"
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
                                        Recipient
                                    </label>
                                    <div>
                                        <input
                                            className="w-80 focus:outline-none focus:ring focus:border-blue-500"
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Enter recipient email address"
                                            required
                                            value={recipient}
                                            onChange={(e) => { setRecipient(e.target.value) }}
                                        />
                                    </div>
                                    <div className="text-red-700">{recipient.length < 2 || recipientIsValid ? '' : recipientError.message}</div>
                                </div>
                                <button className="border-solid hover:bg-blue-400 border-2 border-indigo-700 p-1 rounded-md w-32 bg-white text-blue-700 text-center mt-2" disabled={sending}>Send the letter</button>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <select onChange={(e)=>{fontChangeHandler(e)}}>
                                    {fontmap.map((item, index) => (<option value={index} className={item.className} key={item.id}>Choose your writing style</option>))}
                                </select>
                                <div className="h-full w-full ">
                                    <textarea
                                        className={`w-[38rem] bg-yellow-100 p-2 resize-none overflow-hidden border-solid border border-amber-800 focus:outline-none focus:ring focus:border-blue-500 text-2xl ${selectedFont}`}
                                        id="body"
                                        name="body"
                                        placeholder="The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. -Helen Keller"
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

                    <div className="border-solid hover:bg-blue-400 border-2 border-indigo-700 p-1 rounded-md w-32 bg-white text-blue-700 text-center mt-2 cursor-pointer" onClick={() => { if (!sending) setClosed(!closed) }}>{closed ? 'Open the letter' : 'Close the letter'}</div>
                </div>
            </form>
        </PageContainer>
    )
}