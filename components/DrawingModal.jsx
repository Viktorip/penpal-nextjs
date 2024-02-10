import Drawing from "./Drawing"
import { FaWindowClose } from "react-icons/fa";

export default function DrawingModal({ drawingData, onClose }) {


    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">

                <div className="flex flex-col min-h-full justify-center text-center items-center space-y-4">
                    <div className="bg-gray-100 p-1 hover:ring hover:bg-gray-200 cursor-pointer" onClick={()=>onClose()}>
                        <FaWindowClose className="text-2xl text-gray-800" />
                    </div>
                    <div>
                        <Drawing options={{
                            disabled: true,
                            hideInterface: true
                        }} data={drawingData} hideUI={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}