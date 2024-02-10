import { LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import Image from "next/image";
import { useContext } from "react";


export default function Envelope(props) {
    const { loc, setLoc } = useContext(LocalizationContext);
    
    return (
        <div className={props.className}>
            <div className="max-sm:w-[22.5rem] max-sm:h-[13rem] sm:w-[30rem] sm:h-[17.5rem] bg-[url('/envelope_v2.png')] bg-contain bg-no-repeat relative">
                <div className="absolute max-sm:top-[6rem] max-sm:left-[6rem] sm:top-[8rem] sm:left-[8.25rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden max-sm:text-md sm:text-xl text-gray-200 text-center ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500 bg-zinc-900'}`}
                            placeholder={props.readOnly ? '' : t('envelope_optional_recipient_placeholder', loc)}
                            rows={3}
                            cols={26}
                            maxLength={200}
                            ref={props.optionalRecipientRef}
                            value={props.optionalRecipient}
                            onChange={props.onChangeRecipient}
                            readOnly={props.readOnly ? true : false}
                            spellCheck={false}
                        >
                        </textarea>
                    </div>

                </div>
                <div className="absolute max-sm:top-[0.5rem] max-sm:left-[0.5rem] sm:top-[1.25rem] sm:left-[1rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden max-sm:text-md sm:text-xl text-gray-200 ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500 bg-zinc-900'}`}
                            placeholder={props.readOnly ? '' : t('envelope_optional_sender_placeholder', loc)}
                            rows={3}
                            cols={26}
                            maxLength={200}
                            ref={props.optionalSenderRef}
                            value={props.optionalSender}
                            onChange={props.onChangeSender}
                            readOnly={props.readOnly ? true : false}
                            spellCheck={false}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="absolute max-sm:top-[0.5rem] sm:top-[1rem] max-sm:left-[18rem] sm:left-[24.15rem] z-4 max-sm:w-16 max-sm:h-12 sm:w-20 sm:h-20" onClick={props.onClickStamp}>
                    {props.stamp ?
                        <Image
                            width={90}
                            height={90}
                            src={`/${props.stamp}`}
                            alt={props.stamp}
                            className={props.readOnly ? '' : 'hover:cursor-pointer hover:opacity-70'}
                        />
                        :
                        (!props.readOnly &&                        
                        <div className="text-center select-none text-gray-200 max-sm:text-5xl sm:text-6xl bg-zinc-900 hover:bg-zinc-600 hover:cursor-pointer">!</div>)
                    }

                </div>
            </div>
        </div>
    )
}