import Image from "next/image";


export default function Envelope(props) {
    
    return (
        <div>
            <div className="w-[30rem] h-[18rem] bg-[url('/envelope.png')] bg-contain bg-no-repeat relative">
                <div className="absolute top-[8rem] left-[8.25rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden text-xl text-center ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500'}`}
                            placeholder={props.readOnly ? '' : 'Optional field recipient'}
                            rows={3}
                            cols={26}
                            maxLength={200}
                            ref={props.optionalRecipientRef}
                            value={props.optionalRecipient}
                            onChange={props.onChangeRecipient}
                            readOnly={props.readOnly ? true : false}
                        >
                        </textarea>
                    </div>

                </div>
                <div className="absolute top-[1.25rem] left-[1rem]">
                    <div>
                        <textarea
                            className={`focus:outline-none resize-none overflow-hidden text-xl ${props.style} ${props.readOnly ? 'bg-transparent hover:cursor-default' : 'focus:ring focus:border-blue-500'}`}
                            placeholder={props.readOnly ? '' : 'Optional field sender'}
                            rows={3}
                            cols={26}
                            maxLength={200}
                            ref={props.optionalSenderRef}
                            value={props.optionalSender}
                            onChange={props.onChangeSender}
                            readOnly={props.readOnly ? true : false}
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
                        <div className="text-center select-none text-6xl bg-white hover:bg-blue-100 hover:cursor-pointer">!</div>)
                    }

                </div>
            </div>
        </div>
    )
}

/*

<div className={`absolute top-[1rem] left-[24.15rem] ${props.stamp ? `bg-[url('/${props.stamp}')] bg-contain bg-no-repeat` : ''} z-4 w-20 h-20`} onClick={props.onClickStamp}>

                </div>

*/