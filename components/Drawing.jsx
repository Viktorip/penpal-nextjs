import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { HexColorPicker } from "react-colorful";
import { BsEraserFill } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

export default function Drawing({ options, data, unmountCallback = () => { }, className, hideUI, noDraw = false }) {

    const canvasRef = useRef();
    const anchorRef = useRef();

    const [canvas, setCanvas] = useState();
    const [color, setColor] = useState("#312e81");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [brushSize, setBrushSize] = useState(4);
    const [eraser, setEraser] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(512);
    const [canvasHeight, setCanvasHeight] = useState(640);
    
    useEffect(()=>{
        const ww = window.innerWidth;
        
        if (ww < 640) {
            setCanvasWidth(384);
            setCanvasHeight(480);        
        }else{
            setCanvasWidth(512);
            setCanvasHeight(640);
        }

        if (!hideUI) {
            anchorRef.current.scrollIntoView({behavior: "smooth"});
        }
        
    }, []);


    useEffect(() => {
        if (canvasRef.current && !canvas) {
            setCanvas(canvasRef.current);
            
        }
    }, [canvasRef, canvas]);

    useEffect(() => {
        if (canvas && data) {
            if (!noDraw) {
                canvas.loadSaveData(data);
            } 
        }
    }, [canvas, data, noDraw]);

    useLayoutEffect(() => {
        const ref = canvasRef.current;
        return () => {
            const drawing = ref ? JSON.parse(ref?.getSaveData()) : null;
            if (drawing?.lines.length) {
                unmountCallback(ref?.getSaveData());
            }
        }
    }, []);


    const handleClear = () => {
        canvas.clear();
        unmountCallback('');
    }

    const handleEraser = () => {
        if (!eraser) {
            setEraser('#fff');
        } else {
            setEraser(null);
        }
    }

    return (
        <div ref={anchorRef} className={`${className ? className : ''}`}>
            {!hideUI &&
                <div className="flex flex-row justify-between items-baseline">
                    <div className="m-2 relative hover:ring hover:bg-gray-200 cursor-pointer">
                        <div className="w-6 h-6 border-2 border-black rounded-lg" style={{ backgroundColor: color }} onClick={() => { setShowColorPicker(!showColorPicker) }}>

                        </div>
                        {showColorPicker &&
                            <div className="absolute top-full left-0 z-10">
                                <HexColorPicker color={color} onChange={setColor} />
                            </div>
                        }
                    </div>
                    <div className={`m-2 border-2 border-black rounded-lg hover:ring hover:opacity-75 cursor-pointer ${eraser && 'bg-green-300'}`} onClick={handleEraser}>
                        <BsEraserFill className="text-2xl text-blue-900" />
                    </div>
                    <div className="flex flex-row space-x-2">
                        <input type="range" min="1" max="12" value={brushSize} onChange={(e) => { setBrushSize(parseInt(e.target.value, 10)) }} />
                        <div>{brushSize}</div>
                    </div>
                    <div className="m-2 text-base text-indigo-900 hover:ring hover:bg-gray-200 cursor-pointer" onClick={handleClear}>
                        <FaTrashCan className="text-2xl text-red-700" />
                    </div>
                </div>
            }
            <div style={hideUI ? {} : {
                cursor: eraser ? "url('/eraser.png') 20 44, auto" : "url('/marker_1.png') 1 48, auto"
            }}>
                <CanvasDraw
                    {...options}
                    ref={canvasRef}
                    brushColor={eraser || color}
                    brushRadius={brushSize}
                    gridColor="#fff"
                    onChange={() => {
                        if (showColorPicker) setShowColorPicker(false);
                    }}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                />
            </div>
        </div>
    )
}