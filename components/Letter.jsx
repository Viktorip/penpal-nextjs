
export default function Letter(props) {

    return (
        <div className={`sm:w-[32rem] sm:h-[41rem] max-sm:w-[24rem] max-sm:h-[31rem] sm:py-6 sm:px-10 max-sm:py-4 max-sm:px-7 bg-[url('/custom_letter_v2.png')] bg-contain bg-no-repeat ${props.className}`}>
            
            <textarea
                className={`w-full h-full sm:text-2xl max-sm:text-[1.2rem] max-sm:leading-[1.5rem] pr-1 resize-none overflow-hidden focus:outline-none text-blue-700 text-justify ${props.style} placeholder:text-gray-500 bg-transparent`}
                id="body"
                name="body"
                placeholder={props.placeholder}
                required
                rows="22"
                maxLength={2000}
                minLength={3}
                value={props.value}
                onChange={props.onChange}
                ref={props.taRef}
                readOnly={props.readOnly ? true : false}
                spellCheck={false}
            >
            </textarea>
            
        </div>
    )
}

// bg-[url('/custom_letter_paper.png')] bg-contain bg-no-repeat
