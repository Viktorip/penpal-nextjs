import { LocalizationContext } from "@/app/layout";
import t from "@/lib/localization";
import { useContext, useEffect, useRef, useState } from "react"

export default function Letter({callback, readOnly, style, className, startingValue}) {
    const ref = useRef();
    const anchorRef = useRef();
    const [body, setBody] = useState(startingValue);
    const {loc, setLoc} = useContext(LocalizationContext);

    useEffect(()=>{
        setBody(startingValue);
    }, [startingValue]);

    useEffect(()=>{
        if (!readOnly) {
            anchorRef.current.scrollIntoView({behavior: "smooth"});
            ref.current.focus();
            ref.current.setSelectionRange(9999,9999);
        }
        
    }, [readOnly]);

    const textareaHandler = () => {
        const originalValue = ref.current.value;
        try {
            while (ref.current.clientHeight < ref.current.scrollHeight) { //+2 because of font #2 not being able to go last line
                let halved = Math.ceil(Math.abs((ref.current.value.length - body.length) / 10));
                if (halved < 1) halved = 1;

                ref.current.value = ref.current.value.substring(0, ref.current.value.length - halved);
            }
        } catch (error) {
            console.log("caught error:", error);
        } finally {
            let cutValue;
            if (ref.current.value.length < originalValue.length ) {
                //value was cut
                cutValue = originalValue.substring(ref.current.value.length);
            }
            setBody(ref.current.value);
            callback(ref.current.value, cutValue);
        }
    }

    return (
        <div className={`relative sm:w-[32rem] sm:h-[40rem] max-sm:w-[22.5rem] max-sm:h-[28rem] sm:py-7 sm:px-10 max-sm:py-5 max-sm:px-7 bg-[url('/custom_letter_v3.png')] bg-contain bg-no-repeat ${className}`}>
            <div ref={anchorRef} className="absolute -top-64 left-0"></div>
            <textarea
                className={`w-full h-full sm:text-[1.5rem] max-sm:text-[1.1rem] sm:leading-[1.5rem] max-sm:leading-[1.05rem] pr-1 resize-none overflow-hidden focus:outline-none text-blue-700 text-justify ${style} placeholder:text-gray-500 bg-transparent`}
                id="body"
                name="body"
                placeholder={t('compose_body_placeholder', loc)}
                required
                rows="22"
                maxLength={2000}
                minLength={3}
                onChange={textareaHandler}
                value={body}
                ref={ref}
                readOnly={readOnly}
                spellCheck={false}
            >
            </textarea>
            
        </div>
    )
}

// bg-[url('/custom_letter_paper.png')] bg-contain bg-no-repeat
