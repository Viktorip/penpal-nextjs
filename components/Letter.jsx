
export default function Letter(props) {

    return (
        <div className={`sm:w-[32rem] sm:h-[40rem] max-sm:w-[24rem] max-sm:h-[30rem] sm:py-7 sm:px-10 max-sm:py-5 max-sm:px-7 bg-[url('/custom_letter_v3.png')] bg-contain bg-no-repeat ${props.className}`}>
            
            <textarea
                className={`w-full h-full sm:text-[1.5rem] max-sm:text-[1.14rem] sm:leading-[1.5rem] max-sm:leading-[1.13rem] pr-1 resize-none overflow-hidden focus:outline-none text-blue-700 text-justify ${props.style} placeholder:text-gray-500 bg-transparent`}
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
