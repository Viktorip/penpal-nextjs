
export default function Letter(props) {

    return (
        <div className={`w-[32rem] h-[40rem] py-6 px-10 bg-[url('/custom_letter_v2.png')] bg-contain bg-no-repeat ${props.className}`}>
            
            <textarea
                className={`w-[27.5rem] h-[38rem] pr-1 resize-none overflow-hidden focus:outline-none text-2xl text-blue-700 text-justify ${props.style}  placeholder:text-gray-500 bg-transparent`}
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
