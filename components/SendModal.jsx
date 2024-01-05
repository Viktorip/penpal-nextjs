import { LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import { useContext, useState } from "react";
import { GiMailbox } from "react-icons/gi";

export default function SendModal(props) {
    const { loc, setLoc } = useContext(LocalizationContext);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const handleSubmit = () => {
        setBtnDisabled(true);
        props.formAction();
    }
    
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <form action={handleSubmit}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-16 sm:w-16">
                                        <GiMailbox className="text-blue-500 text-5xl" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 className="text-base font-semibold leading-6 text-black" id="modal-title">{props.title}</h3>
                                        <div className="mt-2 space-y-4">
                                            <p className="text-sm text-black">{props.body}</p>
                                            <div className="flex flex-row space-x-4">
                                                <input
                                                    type="email"
                                                    placeholder={t('email_recipient_placeholder', loc)}
                                                    value={props.value}
                                                    onChange={props.onChange}
                                                    className="w-full h-20 bg-blue-100 border-2 border-indigo-700 rounded-lg text-center outline-none focus:ring focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button className="inline-flex w-full justify-center rounded-md bg-green-400 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto disabled:hover:cursor-not-allowed disabled:hover:bg-gray-300" disabled={btnDisabled}>{btnDisabled ? (<Spinner />) : props.okString}</button>
                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500 sm:mt-0 sm:w-auto disabled:hover:cursor-not-allowed disabled:hover:bg-gray-300" disabled={btnDisabled} onClick={props.cancelCallback}>{props.cancelString}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

const Spinner = () => {

    return (
        <div className="flex flex-row">
        <svg className="animate-spin h-5 w-5 mr-3 place-self-center" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
        </div>
    )
}