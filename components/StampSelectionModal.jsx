import Image from "next/image";


export default function StampSelectionModal(props) {


    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-base font-semibold leading-6 text-indigo-900 text-lg mb-2" id="modal-title">{props.title}</h3>
                                    <p className="text-sm text-indigo-700">{props.body}</p>
                                    <div className="mt-2 flex flex-row space-x-4">
                                        {
                                            props.stamps ?
                                                props.stamps.map(path => (<div key={path} className="cursor-pointer p-2 hover:bg-blue-200"><Image width={90} height={90} src={`/${path}`} alt={path} onClick={() => props.stampCallback(path)} as='image' /></div>)) :
                                                'No stamps found'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500 sm:mt-0 sm:w-auto" onClick={props.cancelCallback}>{props.cancelString}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}