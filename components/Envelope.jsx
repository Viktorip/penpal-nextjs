import { LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import Image from "next/image";
import { useContext } from "react";


export default function Envelope(props) {
    const { loc, setLoc } = useContext(LocalizationContext);
    
    return (
        <div className={props.className}>
            <div className="w-[30rem] h-[17.5rem] bg-[url('/envelope_v2.png')] bg-contain bg-no-repeat relative">
                <div className="absolute top-[8rem] left-[8.25rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden text-xl text-gray-200 text-center ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500 bg-zinc-900'}`}
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
                <div className="absolute top-[1.25rem] left-[1rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden text-xl text-gray-200 ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500 bg-zinc-900'}`}
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
                <div className="absolute top-[1rem] left-[24.15rem] z-4 w-20 h-20" onClick={props.onClickStamp}>
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
                        <div className="text-center select-none text-gray-200 text-6xl bg-zinc-900 hover:bg-zinc-600 hover:cursor-pointer">!</div>)
                    }

                </div>
            </div>
        </div>
    )
}